import { h, getCurrentInstance } from '../../lib/mid-vue.esm.js'
export const Foo = {
  setup(props) {
    const instance = getCurrentInstance()
    console.log('Foo: ', instance)
  },

  render() {
    return h('div', {}, 'foo')
  }
}