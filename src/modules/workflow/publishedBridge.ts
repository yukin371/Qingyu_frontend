import { createDemoPublishedBridgeSource } from './demoSource'
import type { PublishedBridgeAsyncSource, PublishedBridgeSource } from './ports'

const STORAGE_KEY = 'qingyu:workflow:published-books:v1'

export interface PublishedBridgeChapter {
  id: string
  chapterNum: number
  title: string
  content: string
  wordCount: number
  isFree: boolean
  publishedAt?: string
}

export interface PublishedBridgeBook {
  id: string
  title: string
  author: string
  cover: string
  description: string
  tags: string[]
  category: string
  categoryName: string
  status: 'serializing' | 'completed'
  wordCount: number
  chapterCount: number
  rating: number
  viewCount: number
  favoriteCount: number
  lastUpdateTime: string
}

export interface PublishedBridgeBookDetail {
  book: PublishedBridgeBook
  chapters: PublishedBridgeChapter[]
}

type PublishedBridgeStorage = Record<string, PublishedBridgeBookDetail>

export interface PublishedBridgePublishRecord {
  chapter_id: string
  status: string
  published_at?: string
}

const defaultSource = createDemoPublishedBridgeSource()

const getStorage = (): Storage | null => {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null
  }

  try {
    return globalThis.localStorage
  } catch {
    return null
  }
}

const safeParse = (raw: string | null): PublishedBridgeStorage => {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as PublishedBridgeStorage
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const readStorage = (): PublishedBridgeStorage => {
  const storage = getStorage()
  if (!storage) return {}
  return safeParse(storage.getItem(STORAGE_KEY))
}

const writeStorage = (data: PublishedBridgeStorage) => {
  const storage = getStorage()
  if (!storage) return
  storage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const normalizeContent = (raw: string) => raw.replace(/^#\s+.+?\n+/m, '').trim()

const buildBaseFromWriterProject = (
  projectId: string,
  fallbackTitle?: string,
  source: PublishedBridgeSource = defaultSource,
): PublishedBridgeBookDetail | null => {
  const mockProject = source.getProject(projectId)
  if (!mockProject) return null
  const bookSeed = source.getBookSeed(projectId)

  const chapters = mockProject.chapters
    .slice()
    .sort((a, b) => a.chapterNum - b.chapterNum)
    .map((chapter) => {
      const rawContent = mockProject.contentByDocId[chapter.id] || ''
      return {
        id: chapter.id,
        chapterNum: chapter.chapterNum,
        title: chapter.title,
        content: normalizeContent(rawContent),
        wordCount: chapter.wordCount || normalizeContent(rawContent).length,
        isFree: true,
      } as PublishedBridgeChapter
    })

  return {
    book: {
      id: projectId,
      title: mockProject.project.title || fallbackTitle || projectId,
      author: '青羽书院',
      cover: bookSeed.cover || '/images/covers/yunlan-cover.png',
      description: bookSeed.introduction || '来自创作端发布的内容。',
      tags: bookSeed.tags.length > 0 ? [...bookSeed.tags] : ['创作发布'],
      category: '虚构文学',
      categoryName: '虚构文学',
      status: 'serializing',
      wordCount: chapters.reduce((sum, item) => sum + (item.wordCount || 0), 0),
      chapterCount: chapters.length,
      rating: 0,
      viewCount: 0,
      favoriteCount: 0,
      lastUpdateTime: new Date().toISOString(),
    },
    chapters,
  }
}

const buildBaseFromAsyncSource = async (
  projectId: string,
  fallbackTitle: string | undefined,
  source: PublishedBridgeAsyncSource,
): Promise<PublishedBridgeBookDetail | null> => {
  const project = await source.getProject(projectId)
  if (!project) return null
  const bookSeed = await source.getBookSeed(projectId)

  return buildBaseFromWriterProject(projectId, fallbackTitle, {
    getProject: () => project,
    getBookSeed: () => bookSeed,
  })
}

const toSet = (records: PublishedBridgePublishRecord[]) =>
  new Set(records.filter((item) => item.status === 'published').map((item) => item.chapter_id))

export const syncPublishedBookFromRecords = (
  projectId: string,
  records: PublishedBridgePublishRecord[],
  options?: { title?: string; source?: PublishedBridgeSource },
): PublishedBridgeBookDetail | null => {
  const base = buildBaseFromWriterProject(projectId, options?.title, options?.source)
  if (!base) return null

  const publishedSet = toSet(records)
  const publishedAtMap = new Map(records.map((item) => [item.chapter_id, item.published_at]))
  const publishedChapters = base.chapters
    .filter((chapter) => publishedSet.has(chapter.id))
    .map((chapter) => ({
      ...chapter,
      publishedAt: publishedAtMap.get(chapter.id),
    }))

  const storage = readStorage()
  if (publishedChapters.length === 0) {
    delete storage[projectId]
    writeStorage(storage)
    return null
  }

  const detail: PublishedBridgeBookDetail = {
    book: {
      ...base.book,
      chapterCount: publishedChapters.length,
      wordCount: publishedChapters.reduce((sum, item) => sum + (item.wordCount || 0), 0),
      lastUpdateTime: new Date().toISOString(),
      title: options?.title || base.book.title,
    },
    chapters: publishedChapters,
  }

  storage[projectId] = detail
  writeStorage(storage)
  return detail
}

export const syncPublishedBookFromRecordsAsync = async (
  projectId: string,
  records: PublishedBridgePublishRecord[],
  options: { title?: string; source: PublishedBridgeAsyncSource },
): Promise<PublishedBridgeBookDetail | null> => {
  const base = await buildBaseFromAsyncSource(projectId, options.title, options.source)
  if (!base) return null

  const publishedSet = toSet(records)
  const publishedAtMap = new Map(records.map((item) => [item.chapter_id, item.published_at]))
  const publishedChapters = base.chapters
    .filter((chapter) => publishedSet.has(chapter.id))
    .map((chapter) => ({
      ...chapter,
      publishedAt: publishedAtMap.get(chapter.id),
    }))

  const storage = readStorage()
  if (publishedChapters.length === 0) {
    delete storage[projectId]
    writeStorage(storage)
    return null
  }

  const detail: PublishedBridgeBookDetail = {
    book: {
      ...base.book,
      chapterCount: publishedChapters.length,
      wordCount: publishedChapters.reduce((sum, item) => sum + (item.wordCount || 0), 0),
      lastUpdateTime: new Date().toISOString(),
      title: options.title || base.book.title,
    },
    chapters: publishedChapters,
  }

  storage[projectId] = detail
  writeStorage(storage)
  return detail
}

export const listPublishedBookDetails = (): PublishedBridgeBookDetail[] => {
  return Object.values(readStorage())
}

export const listPublishedBookBriefs = (filters?: {
  q?: string
  status?: string
  tags?: string[]
}): PublishedBridgeBook[] => {
  const q = (filters?.q || '').trim().toLowerCase()
  const status = (filters?.status || '').trim()
  const tags = filters?.tags || []

  return listPublishedBookDetails()
    .map((item) => item.book)
    .filter((book) => {
      if (status && book.status !== status) return false
      if (tags.length > 0) {
        const hasTag = tags.some((tag) => (book.tags || []).includes(tag))
        if (!hasTag) return false
      }
      if (!q) return true
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.tags || []).join(' ').toLowerCase().includes(q)
      )
    })
}

export const getPublishedBookDetail = (bookId: string): PublishedBridgeBookDetail | null => {
  return readStorage()[bookId] || null
}

export const shouldUsePublishedBridge = (
  source: unknown,
  bookId: string | null | undefined,
): boolean => {
  const normalizedBookId = String(bookId || '').trim()
  if (source !== 'published' || !normalizedBookId) {
    return false
  }
  return !!getPublishedBookDetail(normalizedBookId)
}

export const getPublishedChapterById = (
  bookId: string,
  chapterId: string,
): PublishedBridgeChapter | null => {
  const detail = getPublishedBookDetail(bookId)
  if (!detail) return null
  return detail.chapters.find((item) => item.id === chapterId) || null
}
