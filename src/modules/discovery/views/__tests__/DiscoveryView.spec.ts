import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import * as discoveryApi from '../../api'
import DiscoveryView from '../DiscoveryView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
})

const createWrapper = () =>
  mount(DiscoveryView, {
    global: {
      plugins: [createPinia(), router],
      stubs: {
        ElTabs: {
          name: 'ElTabs',
          props: ['modelValue'],
          emits: ['tab-change'],
          template:
            '<div class="el-tabs-stub" :data-active-tab="modelValue"><button data-topic-tab @click="$emit(\'tab-change\', \'topic\')">话题</button><slot /></div>',
        },
        ElTabPane: {
          name: 'ElTabPane',
          props: ['label', 'name'],
          template:
            '<section class="el-tab-pane-stub" :data-name="name"><span class="tab-label">{{ label }}</span><slot /></section>',
        },
        ElAlert: true,
        RouterLink: true,
        DiscussionFeed: true,
        BooklistFeed: true,
      },
    },
  })

describe('DiscoveryView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setActivePinia(createPinia())
    vi.spyOn(discoveryApi, 'getRecommendations').mockResolvedValue([])
    vi.spyOn(discoveryApi, 'getPersonalizedRecommendations').mockResolvedValue({
      books: { forYou: [], similar: [], trending: [] },
      booklists: { recommended: [], popular: [] },
      authors: { suggested: [] },
    })
    vi.spyOn(discoveryApi, 'getTrending').mockResolvedValue([])
    vi.spyOn(discoveryApi, 'getTopics').mockResolvedValue({ list: [], total: 0 })
  })

  it('renders the current page shell and starts homepage loading', () => {
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('discovery-view')
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.tabs-section').exists()).toBe(true)
    expect(wrapper.find('.el-tabs-stub').attributes('data-active-tab')).toBe('recommend')
    expect(discoveryApi.getRecommendations).toHaveBeenCalledWith('banner')
    expect(discoveryApi.getPersonalizedRecommendations).toHaveBeenCalledOnce()
    expect(discoveryApi.getTrending).toHaveBeenCalledWith({ type: 'daily' })
  })

  it('renders recommendation and topic tabs', () => {
    const wrapper = createWrapper()

    const labels = wrapper.findAll('.tab-label').map((label) => label.text())
    expect(labels).toEqual(['推荐', '话题'])
    expect(wrapper.text()).toContain('精选推荐')
    expect(wrapper.text()).toContain('热门讨论')
    expect(wrapper.text()).toContain('热门趋势')
  })

  it('retries loading topics after the first request fails', async () => {
    vi.mocked(discoveryApi.getTopics)
      .mockRejectedValueOnce(new Error('网络错误'))
      .mockResolvedValueOnce({ list: [{ id: 'topic-1', title: '话题' }], total: 1 })
    const wrapper = createWrapper()
    const topicTab = wrapper.get('[data-topic-tab]')

    await topicTab.trigger('click')
    await flushPromises()
    await topicTab.trigger('click')
    await flushPromises()

    expect(discoveryApi.getTopics).toHaveBeenCalledTimes(2)
  })
})
