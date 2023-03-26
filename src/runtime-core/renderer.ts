import { SHAPE_FLAGS } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment } from './vnode'

export function render(vnode, container) {
  // patch
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件
  // 通过位运算 & 判断shapeFlag类型
  const { type, shapeFlag } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break
    default:
      if (shapeFlag & SHAPE_FLAGS.ELEMENT) {
        processElement(vnode, container)
      } else if (shapeFlag & SHAPE_FLAGS.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
      }
      break
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { type, props, children, shapeFlag } = vnode
  const el = (vnode.el = document.createElement(type))

  if (shapeFlag & SHAPE_FLAGS.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & SHAPE_FLAGS.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  const isOn = (key: string) => /^on[A-Z]/.test(key)
  for (const key in props) {
    const val = props[key]
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.children.forEach((item) => {
    patch(item, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vnode => patch
  // vnode => element => mountElement
  patch(subTree, container)
  initialVnode.el = subTree.el
}
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container)
}

