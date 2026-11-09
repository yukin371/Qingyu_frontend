import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Grid from '../Grid.vue'

describe('Grid', () => {
  it('sets responsive column counts from the cols object', () => {
    const wrapper = mount(Grid, {
      props: { cols: { sm: 1, md: 2, lg: 4 } },
    })

    expect(wrapper.attributes('style')).toContain('--qy-grid-sm: 1')
    expect(wrapper.attributes('style')).toContain('--qy-grid-md: 2')
    expect(wrapper.attributes('style')).toContain('--qy-grid-lg: 4')
    expect(wrapper.attributes('style')).toContain('--qy-grid-xl: 4')
  })
})
