# 青羽书城前端文档

欢迎来到青羽书城前端项目文档中心！

## 📖 项目简介

青羽书城前端是基于 **Vue 3 + Element Plus** 构建的现代化书城展示系统，为用户提供优雅的书籍浏览和阅读体验。

**技术栈**：Vue 3 + Composition API、Element Plus、Pinia、Vue Router、Axios、Vite

## 🚀 快速开始

### 新手上手（10分钟）

```bash
# 1. 克隆项目
git clone https://github.com/yukin371/Qingyu_frontend.git Qingyu_frontend
cd Qingyu_frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器访问
http://localhost:5173
```

👉 详细步骤请查看 **[快速开始指南](./guide/quick-start.md)**

## 📚 文档导航

### 🎯 [开发指南](./guide/README.md) ⭐ 推荐新手

日常开发必读，包含从入门到精通的完整指南：

- **[快速开始](./guide/quick-start.md)** - 环境搭建和项目启动
- **[项目结构](./guide/project-structure.md)** - 目录组织和文件说明
- **[组件开发](./guide/component-guide.md)** - 组件开发完整教程
- **[页面开发](./guide/page-guide.md)** - 页面开发实战指南
- **[状态管理](./guide/state-management.md)** - Pinia状态管理
- **[API集成](./guide/api-integration.md)** - 后端接口集成
- **[样式开发](./guide/styling.md)** - CSS/样式规范
- **[路由配置](./guide/routing.md)** - Vue Router使用
- **[调试排查](./guide/debugging.md)** - 调试技巧和问题排查

### 🏗️ [架构设计](./architecture/README.md)

项目整体架构和技术决策：

- **[架构总览](./architecture/overview.md)** - 整体架构和技术选型
- **[组件架构](./architecture/组件架构设计.md)** - 组件设计原则
- **[状态管理架构](./architecture/状态管理架构.md)** - Pinia架构设计
- **[性能优化](./architecture/性能优化架构.md)** - 性能优化策略

### 🔌 [API文档](./api/README.md)

后端接口文档和集成说明：

- **[书城API](./api/quick-reference/bookstore.md)** - 首页、榜单、书籍接口
- **[用户API](./api/quick-reference/user.md)** - 认证、个人信息接口
- **[阅读器API](./api/quick-reference/reader.md)** - 章节、书签接口
- **[共享API](./api/frontend/shared/共享服务API参考.md)** - 文件上传、搜索接口
- **[集成说明](./api/frontend/前端集成指南.md)** - 认证和错误处理

### 🧩 [组件文档](./components/README.md)

组件库使用说明：

- **通用组件** - Loading、Empty等
- **业务组件** - BannerCarousel、BookGrid、RankingList等
- 组件API和使用示例

### 📋 [开发规范](./standards/README.md)

代码规范和最佳实践：

- **[代码规范](./standards/组件开发规范.md)** - Vue组件开发规范
- **[样式规范](./standards/样式规范指南.md)** - CSS、主题与响应式规范
- **[工具与Git工作流](./standards/工具使用指南.md)** - 工具链、分支和提交规范
- **[快速参考](./standards/快速参考.md)** - 常用命令和开发速查

### 🧪 [测试文档](./testing/README.md)

测试策略和方法：

- **[测试总览](./testing/README.md)** - 测试策略
- **[集成测试结果](./testing/integration-test-results.md)** - 已执行的集成验证
- **[API测试系统报告](./testing/API测试系统实施报告.md)** - API测试工具与实施记录

### 🚀 [部署运维](./deployment/README.md)

构建、部署和运维：

- **[部署指南](./deployment/deployment-guide.md)** - 构建、部署与环境配置

### 📚 [参考资料](./reference/)

- **[常见问题FAQ](./reference/faq.md)** - 常见问题解答
- **[学习资源](./reference/resources.md)** - 推荐学习资料

## 🎓 学习路径

### 路径 1：新手入门（1-2周）

```
Day 1-2:  快速开始 → 项目结构
Day 3-5:  组件开发
Day 6-8:  页面开发
Day 9-10: 状态管理 + API集成
Day 11-14: 实践项目
```

**阅读顺序**：

1. [快速开始](./guide/quick-start.md)
2. [项目结构](./guide/project-structure.md)
3. [组件开发](./guide/component-guide.md)
4. [页面开发](./guide/page-guide.md)
5. [状态管理](./guide/state-management.md)
6. [API集成](./guide/api-integration.md)

### 路径 2：前端开发（2-4周）

在新手基础上深入学习：

- 架构设计文档
- 开发规范和最佳实践
- 性能优化
- 测试策略

### 路径 3：全栈开发（4周+）

- 前端开发（本文档）
- 后端API对接
- 数据库设计
- 部署运维

## 🛠️ 常见任务

### 开发新功能

```
1. 创建功能分支
2. 开发组件/页面
3. 集成API
4. 编写测试
5. 提交代码
6. Code Review
7. 合并主分支
```

👉 参考 **[工具与Git工作流](./standards/工具使用指南.md)**

### 修复Bug

```
1. 复现问题
2. 定位原因
3. 修复代码
4. 测试验证
5. 提交修复
```

👉 参考 **[调试指南](./guide/debugging.md)**

### 性能优化

```
1. 性能分析
2. 定位瓶颈
3. 优化方案
4. 测试对比
5. 上线监控
```

👉 参考 **[性能优化](./architecture/性能优化架构.md)**

## 📊 项目状态

- ✅ **基础架构** - Vue 3 + Element Plus 搭建完成
- ✅ **核心功能** - 首页、榜单、书籍展示完成
- ✅ **状态管理** - Pinia集成完成
- ✅ **API集成** - 后端接口对接完成
- ✅ **路由系统** - Vue Router配置完成
- 🚧 **功能扩展** - 持续开发中
- 📋 **测试覆盖** - 逐步完善中

## 🔗 相关链接

- **后端项目**：[Qingyu Backend](../../Qingyu_backend/)
- **写作端**：[Qingyu Editor](../../Qingyu-Editor/)
- **在线演示**：[Demo Site](https://demo.qingyu.com)（待上线）

## 💡 开发建议

### 新手建议

1. **从小做起**：从简单组件开始
2. **多看代码**：参考现有组件实现
3. **勤于调试**：使用Vue DevTools
4. **问题记录**：遇到问题记录下来
5. **团队协作**：多与团队沟通

### 进阶建议

1. **深入源码**：理解Vue 3原理
2. **性能优化**：关注性能指标
3. **架构思考**：思考更好的设计
4. **分享知识**：写技术文档
5. **持续学习**：关注前沿技术

## 📝 文档贡献

### 如何贡献

1. 发现文档问题或需要补充
2. 创建文档分支
3. 编写或修改文档
4. 提交Pull Request
5. Code Review
6. 合并文档

### 文档规范

- 使用Markdown格式
- 代码示例完整可运行
- 保持简洁清晰
- 及时更新

## ❓ 获取帮助

### 文档内查找

1. 使用浏览器搜索（Ctrl+F）
2. 查看对应章节目录
3. 阅读相关参考资料

### 团队协作

- **提问**：在团队群组提问
- **讨论**：参加技术讨论会
- **求助**：向有经验的同事请教

### 在线资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 📅 版本历史

### v2.0.0 (2025-10-17)

- 🎉 重组文档结构
- ✨ 新增开发指南系列
- 📝 完善API文档
- 🏗️ 优化架构文档
- 🔧 添加调试指南

### v1.0.0 (2025-09)

- 🎉 初始版本发布
- 📝 基础文档搭建

---

**文档版本**：v2.0.0  
**最后更新**：2025年10月17日  
**维护团队**：前端开发团队

**开始你的开发之旅** 👉 [快速开始](./guide/quick-start.md)
