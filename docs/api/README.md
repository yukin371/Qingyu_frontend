# API文档

后端接口文档和集成说明。

## API模块

### [书城API](./quick-reference/bookstore.md)

书城相关接口，包括：

- 首页数据
- 榜单（实时榜、周榜、月榜、新人榜）
- Banner轮播
- 书籍列表和详情
- 分类管理

### [用户API](./quick-reference/user.md)

用户相关接口：

- 用户登录/注册
- 用户信息管理
- 密码修改
- 退出登录

### [阅读器API](./quick-reference/reader.md)

阅读功能接口：

- 章节内容
- 阅读进度
- 书签管理
- 阅读历史

### [共享API](./frontend/shared/共享服务API参考.md)

通用功能接口：

- 文件上传
- 搜索功能
- 图片处理

## [集成说明](./frontend/前端集成指南.md)

- 认证机制
- 错误处理
- 请求格式
- 响应格式

## 快速开始

查看 [API集成指南](../guide/api-integration.md) 了解如何集成后端接口。

## 环境配置

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:8080/api/v1

# 生产环境
VITE_API_BASE_URL=https://api.qingyu.com/api/v1
```

---

**最后更新**：2025年10月17日
