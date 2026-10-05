import { yunlanBookMeta } from '@/modules/bookstore/public'
import { getWorkspaceMockProject } from '@/modules/writer'
import type { PublishedBridgeSource } from './ports'

// Transitional adapter for local demos. It is not a production data source.
export const createDemoPublishedBridgeSource = (): PublishedBridgeSource => ({
  getProject: (projectId) => getWorkspaceMockProject(projectId),
  getBookSeed: () => ({
    cover: yunlanBookMeta.cover,
    introduction: yunlanBookMeta.introduction,
    tags: [...yunlanBookMeta.tags],
  }),
})
