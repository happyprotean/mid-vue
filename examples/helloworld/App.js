import { h } from '../../lib/mid-vue.esm.js'

export const App = {

  render() {
    return h('div', 'hi ' + this.msg)
  },

  setup() {
    return {
      msg: 'mid-vue',
    }
  },
}