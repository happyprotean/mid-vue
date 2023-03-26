import { SHAPE_FLAGS } from "../shared/ShapeFlags"

export const Fragment = Symbol('Fragment')

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  }
  if (typeof children === 'string') {
    vnode.shapeFlag |=  SHAPE_FLAGS.TEXT_CHILDREN
  } else if(Array.isArray(children)) {
    vnode.shapeFlag |= SHAPE_FLAGS.ARRAY_CHILDREN
  }

  // 组件类型且children为对象时，表示传入了slots
  if (vnode.shapeFlag & SHAPE_FLAGS.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= SHAPE_FLAGS.SLOT_CHILDREN
    }
  }

  return vnode
}

export function getShapeFlag(type) {
  return typeof type === 'string' ? SHAPE_FLAGS.ELEMENT : SHAPE_FLAGS.STATEFUL_COMPONENT
}