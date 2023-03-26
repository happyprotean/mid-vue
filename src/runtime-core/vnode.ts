import { SHAPE_FLAGS } from "../shared/ShapeFlags"

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
  return vnode
}

export function getShapeFlag(type) {
  return typeof type === 'string' ? SHAPE_FLAGS.ELEMENT : SHAPE_FLAGS.STATEFUL_COMPONENT
}