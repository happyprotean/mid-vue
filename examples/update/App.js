import { h, ref, reactive } from '../../lib/mid-vue.esm.js'

export const App = {
  name: 'App',

  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })
    const onChangePropsDemo1 = () => {
      // TODO: props.value.foo直接更改的话，没有触发effect
      // props.value.foo = 'new-foo'
      props.value = {
        foo: 'new-foo',
        bar: 'bar',
      }
    }
    const onChangePropsDemo2 = () => {
      props.value = {
        foo: undefined,
        bar: 'bar',
      }
    }
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo',
      }
    }
    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    }
  },

  render() {
    console.log('props', this.props)
    return h(
      'div',
      {
        id: 'root',
        ...this.props,
      },
      [
        h('div', {}, 'count' + this.count),
        h(
          'button',
          {
            onClick: this.onClick,
          },
          'click'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo1,
          },
          '值改变'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo2,
          },
          '值变成undefined'
        ),
        h(
          'button',
          {
            onClick: this.onChangePropsDemo3,
          },
          '属性不再存在'
        ),
      ]
    )
  },
}
