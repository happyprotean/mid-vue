import { h, provide, inject } from '../../lib/mid-vue.esm.js'

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooval')
    provide('bar', 'barval')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(ProviderTwo)])
  },
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'fooTwo')
    const foo = inject('foo')
    return { foo }
  },
  render() {
    return h('div', {}, [
      h('p', {}, 'Provider Two, foo: ' + this.foo),
      h(Consumer),
    ])
  },
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', () => 'bazDefault')
    return {
      foo,
      bar,
      baz,
    }
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
  },
}

export const App = {
  name: 'App',
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
  },

  setup() {
    provide('foo', 'App')
    // inject('foo')
  },
}
