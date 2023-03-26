import { h } from '../../lib/mid-vue.esm.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick: function() {
          console.log('click')
        },
        onMousedown() {
          console.log('mousedown')
        }
      },
      // setupState
      // this.$el
      'hi ' + this.msg
      // [h('p', { class: 'red' }, 'hello'), h('p', { class: 'blue' }, 'mid-vue')]
    )
  },

  setup() {
    return {
      msg: 'mid-vue',
    }
  },
}
