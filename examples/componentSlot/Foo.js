import { h, renderSlots } from '../../lib/mid-vue.esm.js'
export const Foo = {
  setup() {
    return {}
  },

  render() {
    const foo = h('p', {}, 'foo')
    console.log('slots', this.$slots)
    const age = 18
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ])
  },
}
