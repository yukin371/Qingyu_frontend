import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoadingOverlay from '../LoadingOverlay.vue'

describe('LoadingOverlay', () => {
  it('stays hidden until visible is enabled and renders text/fullscreen state', async () => {
    const wrapper = mount(LoadingOverlay, {
      props: { visible: false, text: '加载中' },
      global: {
        stubs: {
          'el-icon': { template: '<span><slot /></span>' },
          Loading: { template: '<span />' },
        },
      },
    })

    expect(wrapper.find('.qy-loading-overlay').exists()).toBe(false)
    await wrapper.setProps({ visible: true, fullscreen: true })
    expect(wrapper.find('.qy-loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.qy-loading-overlay').classes()).toContain(
      'qy-loading-overlay--fullscreen',
    )
    expect(wrapper.find('.qy-loading-overlay__text').text()).toBe('加载中')
  })

  it('emits close only when closeOnClick is enabled', async () => {
    const wrapper = mount(LoadingOverlay, {
      props: { visible: true, closeOnClick: true },
      global: {
        stubs: {
          'el-icon': { template: '<span><slot /></span>' },
          Loading: { template: '<span />' },
        },
      },
    })

    await wrapper.find('.qy-loading-overlay').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
