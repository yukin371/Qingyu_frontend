import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormCard from '../FormCard.vue'

describe('FormCard', () => {
  it('reacts to updated props and emits submit/cancel events', async () => {
    const wrapper = mount(FormCard, {
      props: { title: '初始标题', loading: false },
      global: {
        stubs: {
          'el-card': {
            template: '<div><slot name="header" /><slot /><slot name="footer" /></div>',
          },
          'el-button': {
            props: ['type', 'loading'],
            emits: ['click'],
            template: '<button :data-loading="loading" @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('初始标题')
    await wrapper.setProps({ title: '更新后的标题', loading: true })
    expect(wrapper.text()).toContain('更新后的标题')
    expect(wrapper.findAll('button')[1].attributes('data-loading')).toBe('true')

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })
})
