export interface PublishedBridgeProject {
  project: { title: string }
  chapters: Array<{
    id: string
    chapterNum: number
    title: string
    wordCount: number
  }>
  contentByDocId: Record<string, string>
}

export interface PublishedBridgeBookSeed {
  cover: string
  introduction: string
  tags: string[]
}

// Workflow only needs these read models; adapters own the source-specific mapping.
export interface PublishedBridgeSource {
  getProject(projectId: string): PublishedBridgeProject | null
  getBookSeed(projectId?: string): PublishedBridgeBookSeed
}

// HTTP adapters load the same read models asynchronously. Keeping this port
// separate lets the demo/localStorage path remain synchronous for Storybook
// and Vitest without weakening its existing contract.
export interface PublishedBridgeAsyncSource {
  getProject(projectId: string): Promise<PublishedBridgeProject | null>
  getBookSeed(projectId?: string): Promise<PublishedBridgeBookSeed>
}
