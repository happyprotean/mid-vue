import { PublicInstanceHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  }
  return component
}

export function setupComponent(instance) {
  // TODO:
  // initProps
  // initSlots 
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers)
  const component = instance.type
  const { setup } = component
  if (setup) {
    const setupResult = setup()
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

