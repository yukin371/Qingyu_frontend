# Workflow 模块上下文

状态：过渡集成模块；前端发布内容投影 owner 已由 ADR-0004 确认，source port 与 demo adapter 已落地，真实 API adapter 待 F-004-WF-002 完成。

## 当前职责

- 暂时承载 Writer 发布记录到书城/阅读体验投影的前端桥接逻辑。
- `public.ts` 是其他业务模块消费该桥接能力的公开入口；调用方不得导入 `publishedBridge.ts` 私有实现。

## 已知边界问题

- `demoSource.ts` 通过 `PublishedBridgeSource` 适配 bookstore demo 数据和 writer workspace mock；`publishedBridge.ts` 只依赖该最小 source port，并将投影写入浏览器 `localStorage`。
- demo adapter 属于开发/演示兼容路径，不能作为生产数据源；不得把 mock 或 localStorage 视为发布状态和书籍数据真相。
- `workflow` 只拥有前端投影编排；最小 source port、真实 API adapter 和 mock adapter 的退役条件见父仓 `ADR-0004` 与 Phase 2/T1 `F-004-WF-002`。
