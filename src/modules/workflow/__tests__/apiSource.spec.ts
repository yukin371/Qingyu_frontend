import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPublishedApiSource } from '@/modules/workflow/apiSource'
import {
  syncPublishedBookFromRecordsAsync,
  getPublishedBookDetail,
} from '@/modules/workflow/public'
import { getChapterContent, getBookPublishedChapters } from '@/modules/bookstore/api'
import { getProjectPublications } from '@/modules/writer/api'

vi.mock('@/modules/bookstore/api', () => ({
  getChapterContent: vi.fn(),
  getBookPublishedChapters: vi.fn(),
}))

vi.mock('@/modules/writer/api', () => ({
  getProjectPublications: vi.fn(),
}))

describe('published API source', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps publication externalId to the bookstore book and projectChapterId back to writer documents', async () => {
    vi.mocked(getProjectPublications).mockResolvedValue({
      data: [
        {
          type: 'project',
          status: 'published',
          resourceTitle: '远方',
          externalId: 'book-object-id',
          metadata: {
            coverImage: '/cover.png',
            description: '简介',
            tags: ['幻想'],
          },
        },
      ],
      pagination: { hasNext: false },
    } as never)
    vi.mocked(getBookPublishedChapters).mockResolvedValue({
      data: [
        {
          id: 'chapter-object-id',
          projectChapterId: 'writer-document-id',
          chapterNum: 1,
          title: '第一章',
          wordCount: 4,
        },
      ],
      pagination: { hasNext: false },
    } as never)
    vi.mocked(getChapterContent).mockResolvedValue({
      chapter_id: 'chapter-object-id',
      content: '# 第一章\n正文',
      paragraphs: [],
    } as never)

    const source = createPublishedApiSource()
    const project = await source.getProject('project-id')

    expect(getProjectPublications).toHaveBeenCalledWith('project-id', {
      page: 1,
      pageSize: 100,
    })
    expect(getBookPublishedChapters).toHaveBeenCalledWith('book-object-id', {
      page: 1,
      size: 100,
    })
    expect(getChapterContent).toHaveBeenCalledWith('chapter-object-id')
    expect(project).toEqual({
      project: { title: '远方' },
      chapters: [
        {
          id: 'writer-document-id',
          chapterNum: 1,
          title: '第一章',
          wordCount: 4,
        },
      ],
      contentByDocId: { 'writer-document-id': '# 第一章\n正文' },
    })
    await expect(source.getBookSeed('project-id')).resolves.toEqual({
      cover: '/cover.png',
      introduction: '简介',
      tags: ['幻想'],
    })
  })

  it('loads the seed after the project so the async projection keeps publication metadata', async () => {
    const storage = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    })
    vi.mocked(getProjectPublications).mockResolvedValue({
      data: [
        {
          type: 'project',
          status: 'published',
          resourceTitle: '远方',
          externalId: 'book-object-id',
          metadata: { coverImage: '/cover.png', description: '简介', tags: ['幻想'] },
        },
      ],
    } as never)
    vi.mocked(getBookPublishedChapters).mockResolvedValue({
      data: [
        {
          id: 'chapter-object-id',
          projectChapterId: 'writer-document-id',
          chapterNum: 1,
          title: '第一章',
          wordCount: 2,
        },
      ],
    } as never)
    vi.mocked(getChapterContent).mockResolvedValue({ content: '正文' } as never)

    const source = createPublishedApiSource()
    await syncPublishedBookFromRecordsAsync(
      'project-id',
      [{ chapter_id: 'writer-document-id', status: 'published' }],
      { source },
    )

    expect(getPublishedBookDetail('project-id')?.book).toMatchObject({
      title: '远方',
      cover: '/cover.png',
      description: '简介',
      tags: ['幻想'],
    })
  })

  it('fails closed when a published project has no bookstore mapping', async () => {
    vi.mocked(getProjectPublications).mockResolvedValue({
      data: [{ type: 'project', status: 'published', resourceTitle: '无映射' }],
    } as never)

    await expect(createPublishedApiSource().getProject('project-id')).rejects.toThrow(
      'PublicationRecord.externalId',
    )
  })
})
