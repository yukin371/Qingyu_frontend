import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getPublishedBookDetail,
  syncPublishedBookFromRecords,
  type PublishedBridgeSource,
} from '@/modules/workflow/public'

const storage = new Map<string, string>()
const localStorageMock: Storage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  key: (index) => Array.from(storage.keys())[index] ?? null,
  get length() {
    return storage.size
  },
}

const source: PublishedBridgeSource = {
  getProject: () => ({
    project: { title: '测试项目' },
    chapters: [
      { id: 'chapter-1', chapterNum: 1, title: '第一章', wordCount: 12 },
      { id: 'chapter-2', chapterNum: 2, title: '第二章', wordCount: 8 },
    ],
    contentByDocId: {
      'chapter-1': '# 第一章\n正文一',
      'chapter-2': '正文二',
    },
  }),
  getBookSeed: () => ({
    cover: '/test-cover.png',
    introduction: '测试简介',
    tags: ['测试'],
  }),
}

describe('published bridge source port', () => {
  beforeEach(() => {
    storage.clear()
    vi.stubGlobal('localStorage', localStorageMock)
  })

  it('builds a projection from the injected source instead of a module mock', () => {
    const detail = syncPublishedBookFromRecords(
      'project-1',
      [
        { chapter_id: 'chapter-1', status: 'published', published_at: '2026-10-05' },
        { chapter_id: 'chapter-2', status: 'draft' },
      ],
      { source },
    )

    expect(detail?.book.title).toBe('测试项目')
    expect(detail?.book.cover).toBe('/test-cover.png')
    expect(detail?.chapters).toHaveLength(1)
    expect(detail?.chapters[0].content).toBe('正文一')
    expect(getPublishedBookDetail('project-1')).toEqual(detail)
  })

  it('removes a projection when no chapter remains published', () => {
    syncPublishedBookFromRecords('project-1', [{ chapter_id: 'chapter-1', status: 'published' }], {
      source,
    })
    expect(getPublishedBookDetail('project-1')).not.toBeNull()

    const removed = syncPublishedBookFromRecords('project-1', [], { source })

    expect(removed).toBeNull()
    expect(getPublishedBookDetail('project-1')).toBeNull()
  })
})
