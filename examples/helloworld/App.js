import { h } from '../../lib/mid-vue.esm.js'

export const App = {

  render() {
    return h('div', {
      id: 'root',
      class: ['red', 'hard'],
    },
    [
      h('p', { class: 'red' }, 'hello'),
      h('p', { class: 'blue' }, 'mid-vue'),
    ])
  },

  setup() {
    return {
      msg: 'mid-vue',
    }
  },
}