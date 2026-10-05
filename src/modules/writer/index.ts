/**
 * 写作模块统一导出
 *
 * @module writer
 */

// API 导出
export * from './api'

// 类型导出
export type { Project, Document, Node } from './types'

// DocumentTreeNode 作为 Node 的别名
export type { Node as DocumentTreeNode } from './types'

// 过渡期工作区 mock 通过模块入口提供，避免 workflow 穿透私有目录。
export { getWorkspaceMockProject } from './mock/workspaceMock'
export type { PublishRecord } from './api/publish'
