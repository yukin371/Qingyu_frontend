import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormSection from '../FormSection.vue'

describe('FormSection', () => {
  it('renders label, required marker, description, hint and slot content', () => {
    const wrapper = mount(FormSection, {
      props: {
        label: '用户名',
        description: '用于登录',
        hint: '请输入真实用户名',
        required: true,
      },
      slots: { default: '<input data-testid="field" />' },
    })

    expect(wrapper.find('.qy-form-section__label-text').text()).toContain('用户名')
    expect(wrapper.find('.qy-form-section__required').exists()).toBe(true)
    expect(wrapper.find('.qy-form-section__description').text()).toBe('用于登录')
    expect(wrapper.find('.qy-form-section__hint-text').text()).toBe('请输入真实用户名')
    expect(wrapper.find('[data-testid="field"]').exists()).toBe(true)
  })

  it('applies the horizontal layout class and supports named slots', () => {
    const wrapper = mount(FormSection, {
      props: { layout: 'horizontal' },
      slots: {
        label: '<span data-testid="custom-label">自定义</span>',
        hint: '<span data-testid="custom-hint">提示</span>',
      },
    })

    expect(wrapper.classes()).toContain('qy-form-section--horizontal')
    expect(wrapper.find('[data-testid="custom-label"]').text()).toBe('自定义')
    expect(wrapper.find('[data-testid="custom-hint"]').text()).toBe('提示')
  })
})
