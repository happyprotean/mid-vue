import { h } from '../../lib/mid-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',

  setup() {
    return {}
  },

  render() {
    const app = h('div', {}, 'App')
    // const foo = h(Foo, {}, h('p', {}, '123'))
    // 具名插槽
    // 作用域插槽
    const foo = h(
      Foo,
      {},
      { 
        header: ({ age }) => h('p', {}, 'header' + age),
        footer: () => h('p', {}, 'footer'),
      }
    )
    return h('div', {}, [app, foo])
  },
}
