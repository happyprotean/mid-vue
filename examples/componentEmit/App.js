import { h } from '../../lib/mid-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    // emit
    return h('div', {}, [h('div', {}, 'App'), h(Foo, {
      // on + Event
      onAdd: function(a, b) {
        console.log('onAdd', a, b)
      },
      onAddFoo: function() {
        console.log('onAddFoo')
      },
    })])
  },

  setup() {
    return {}
  },
}
