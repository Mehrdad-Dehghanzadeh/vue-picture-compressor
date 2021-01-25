import { shallowMount } from '@vue/test-utils'
import imageEditor from '@/components/imageEditor.vue'

describe('imageEditor.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(imageEditor, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
