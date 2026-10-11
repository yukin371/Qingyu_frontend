# 测试文档

测试策略、方法和指南。

## 测试策略

### 测试金字塔

```
        /\
       /  \      E2E测试
      /    \     (少量，关键流程)
     /------\
    /        \   集成测试
   /          \  (适量，模块交互)
  /------------\
 /              \ 单元测试
/________________\(大量，函数/组件)
```

- **单元测试**：测试独立函数和组件（最多）
- **集成测试**：测试组件间交互（中等）
- **E2E测试**：测试用户流程（最少）

## 测试文档

### [集成测试结果](./integration-test-results.md)

- 当前已执行的集成测试结果
- 失败项与环境限制记录

### [API测试系统实施报告](./API测试系统实施报告.md)

- API测试工具与运行方式
- 测试系统实施记录

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
# 运行所有测试
npm run test:vitest

# 监听模式
npm run test

# 生成覆盖率报告
npm run test:vitest:coverage
```

## 测试示例

### 组件测试

```javascript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BookCard from '@/components/BookCard.vue'

describe('BookCard', () => {
  it('renders book info', () => {
    const wrapper = mount(BookCard, {
      props: {
        book: { id: '1', title: 'Test' },
      },
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Store测试

```javascript
import { setActivePinia, createPinia } from 'pinia'
import { useBookstoreStore } from '@/stores/bookstore'

describe('Bookstore Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fetches books', async () => {
    const store = useBookstoreStore()
    await store.fetchBooks()
    expect(store.books.length).toBeGreaterThan(0)
  })
})
```

## 测试覆盖率目标

- 单元测试：≥ 80%
- 集成测试：核心功能100%
- E2E测试：关键用户流程

---

**最后更新**：2025年10月17日
