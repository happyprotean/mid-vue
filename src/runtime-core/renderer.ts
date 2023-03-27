import { SHAPE_FLAGS } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options

  function render(vnode, container) {
    // patch
    patch(vnode, container, null)
  }

  function patch(vnode, container, parentComponent) {
    // 处理组件
    // 通过位运算 & 判断shapeFlag类型
    const { type, shapeFlag } = vnode
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break
      case Text:
        processText(vnode, container)
        break
      default:
        if (shapeFlag & SHAPE_FLAGS.ELEMENT) {
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & SHAPE_FLAGS.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent)
        }
        break
    }
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode, container, parentComponent) {
    const { type, props, children, shapeFlag } = vnode
    const el = (vnode.el = createElement(type))

    if (shapeFlag & SHAPE_FLAGS.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & SHAPE_FLAGS.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      patchProp(el, key, val)
    }

    insert(el, container)
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((item) => {
      patch(item, container, parentComponent)
    })
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vnode => patch
    // vnode => element => mountElement
    patch(subTree, container, instance)
    initialVnode.el = subTree.el
  }

  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children))
    container.append(textNode)
  }

  return {
    createApp: createAppAPI(render),
  }
}
