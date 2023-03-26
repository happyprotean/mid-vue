import { h } from '../../lib/mid-vue.esm.js'
export const Foo = {
  setup(props) {
    console.log(props)
    // props为shallowReadonly
    props.count++
  },

  render() {
    return h('div', {}, 'foo: ' + this.count)
  }
}