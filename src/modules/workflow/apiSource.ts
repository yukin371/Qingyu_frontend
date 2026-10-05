import { getChapterContent, getBookPublishedChapters } from '@/modules/bookstore/api'
import { getProjectPublications } from '@/modules/writer/api'
import type {
  PublishedBridgeAsyncSource,
  PublishedBridgeBookSeed,
  PublishedBridgeProject,
} from './ports'

type ApiRecord = Record<string, any>

const asList = (value: unknown): ApiRecord[] => {
  if (Array.isArray(value)) return value as ApiRecord[]
  if (!value || typeof value !== 'object') return []
  const payload = value as ApiRecord
  if (Array.isArray(payload.data)) return payload.data as ApiRecord[]
  if (Array.isArray(payload.items)) return payload.items as ApiRecord[]
  if (Array.isArray(payload.list)) return payload.list as ApiRecord[]
  return []
}

const asObject = (value: unknown): ApiRecord => {
  if (!value || typeof value !== 'object') return {}
  const payload = value as ApiRecord
  return payload.data && typeof payload.data === 'object' ? payload.data : payload
}

const hasNextPage = (value: unknown, itemCount: number, pageSize: number) => {
  const payload = value && typeof value === 'object' ? (value as ApiRecord) : {}
  const pagination = payload.pagination as ApiRecord | undefined
  if (typeof pagination?.hasNext === 'boolean') return pagination.hasNext
  if (typeof pagination?.has_next === 'boolean') return pagination.has_next
  return itemCount === pageSize
}

const loadPublishedChapters = async (bookId: string): Promise<ApiRecord[]> => {
  const pageSize = 100
  const chapters: ApiRecord[] = []
  for (let page = 1; page <= 20; page += 1) {
    const response = await getBookPublishedChapters(bookId, { page, size: pageSize })
    const pageItems = asList(response)
    chapters.push(...pageItems)
    if (!hasNextPage(response, pageItems.length, pageSize)) break
  }
  return chapters
}

const toChapter = async (chapter: ApiRecord) => {
  const bookstoreChapterId = String(chapter.id || '').trim()
  if (!bookstoreChapterId) return null

  const content = asObject(await getChapterContent(bookstoreChapterId))
  const projectChapterId = String(
    chapter.projectChapterId || chapter.project_chapter_id || bookstoreChapterId,
  )
  const rawContent = typeof content.content === 'string' ? content.content : ''
  return {
    id: projectChapterId,
    chapterNum: Number(chapter.chapterNum ?? chapter.chapter_num ?? 0),
    title: String(chapter.title || '未命名章节'),
    wordCount: Number(chapter.wordCount ?? chapter.word_count ?? rawContent.length),
    content: rawContent,
  }
}

export const createPublishedApiSource = (): PublishedBridgeAsyncSource => {
  const seeds = new Map<string, PublishedBridgeBookSeed>()

  return {
    async getProject(projectId) {
      const response = await getProjectPublications(projectId, { page: 1, pageSize: 100 })
      const records = asList(response)
      const projectRecord = records.find(
        (record) => record.type === 'project' && record.status === 'published',
      )
      const bookId = String(projectRecord?.externalId || projectRecord?.external_id || '').trim()
      if (!projectRecord || !bookId) {
        throw new Error(`项目 ${projectId} 缺少已发布书籍映射（PublicationRecord.externalId）`)
      }

      const metadata = (projectRecord.metadata || {}) as ApiRecord
      seeds.set(projectId, {
        cover: String(metadata.coverImage || metadata.cover_image || ''),
        introduction: String(metadata.description || ''),
        tags: Array.isArray(metadata.tags) ? metadata.tags.map(String) : [],
      })

      const chapters = await loadPublishedChapters(bookId)
      const resolvedChapters = (await Promise.all(chapters.map(toChapter))).filter(
        (chapter): chapter is NonNullable<typeof chapter> => chapter !== null,
      )

      return {
        project: { title: String(projectRecord.resourceTitle || projectId) },
        chapters: resolvedChapters.map(({ content, ...chapter }) => chapter),
        contentByDocId: Object.fromEntries(
          resolvedChapters.map((chapter) => [chapter.id, chapter.content]),
        ),
      } satisfies PublishedBridgeProject
    },

    async getBookSeed(projectId) {
      return seeds.get(projectId || '') || { cover: '', introduction: '', tags: [] }
    },
  }
}
