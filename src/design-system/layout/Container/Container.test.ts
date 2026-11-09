import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Container from './Container.vue'

describe('Container', () => {
  it('uses full width when fluid is enabled', () => {
    const wrapper = mount(Container, {
      props: { size: 'sm', fluid: true },
    })

    expect(wrapper.classes()).toContain('max-w-full')
    expect(wrapper.classes()).not.toContain('max-w-sm')
  })
})
