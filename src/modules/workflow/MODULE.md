# Workflow 模块上下文

状态：过渡集成模块；前端发布内容投影 owner 已由 ADR-0004 确认，同步 demo source、异步 source port 与真实 API adapter 已落地。

## 当前职责

- 暂时承载 Writer 发布记录到书城/阅读体验投影的前端桥接逻辑。
- `public.ts` 是其他业务模块消费该桥接能力的公开入口；调用方不得导入 `publishedBridge.ts` 私有实现。

## 已知边界问题

- `demoSource.ts` 通过 `PublishedBridgeSource` 适配 bookstore demo 数据和 writer workspace mock；`apiSource.ts` 通过 `PublishedBridgeAsyncSource` 消费 writer/bookstore canonical API，并将投影写入浏览器 `localStorage`。
- demo adapter 属于开发/演示兼容路径，不能作为生产数据源；不得把 mock 或 localStorage 视为发布状态和书籍数据真相。
- `workflow` 只拥有前端投影编排；真实 adapter 以发布记录 `externalId` 作为 bookstore book ID，缺少映射时 fail closed。跨部署实现的字段语义仍需按父仓 Phase 2/T1 `T1-WF-003` 固化。
