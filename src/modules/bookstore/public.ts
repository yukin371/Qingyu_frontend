export { resolveBookCover, getFallbackBookCover } from './utils/cover-resolver'
export type { BookBrief } from './types/bookstore.types'

// 过渡期 demo 数据只通过显式公开出口提供，禁止跨模块深入 mock 文件。
export {
  YUNLAN_BOOK_ID,
  YUNLAN_BOOK_TITLE,
  YUNLAN_TOTAL_CHAPTERS,
  createYunlanReaderChapters,
  yunlanBookMeta,
} from './yunlanDemo.mock'
