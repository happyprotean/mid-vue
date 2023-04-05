import { proxyRefs } from '../reactivity'
import { shallowReadonly } from '../reactivity/reactive'
import { emit } from './componentEmit'
import { initProps } from './componentProps'
import { PublicInstanceHandlers } from './componentPublicInstance'
import { initSlots } from './componentSlot'

let currentInstance = null

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    next: null,
    setupState: {},
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    isMounted: false,
    subTree: {},
    emit: () => {},
  }
  // 绑定components参数，避免用户在调用emit时，额外的参数传递, 如emit(instance, event)
  component.emit = emit.bind(null, component) as any
  return component
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers)
  const component = instance.type
  const { setup } = component
  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    })
    handleSetupResult(instance, setupResult)
    setCurrentInstance(null)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO: function
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  if (compiler && !Component.render) {
    if (Component.template) {
      Component.render = compiler(Component.template)
    }
  }
  if (Component.render) {
    instance.render = Component.render
  }
}

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}

let compiler

export function registerRuntimeCompiler(_compiler) {
  compiler = _compiler
}
