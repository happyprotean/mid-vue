import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  }
  return component
}

export function setupComponent(instance) {
  // TODO:
  initProps(instance, instance.vnode.props)
  // initSlots 
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers)
  const component = instance.type
  const { setup } = component
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props))
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  // TODO: function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const component = instance.type
  if (component.render) {
    instance.render = component.render
  }
}

