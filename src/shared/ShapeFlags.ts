/**
 * 位运算判断shapeFlag，提高性能
 * element: 通过h函数创建，如h('div', {id: 'id'}, 'msg')
 * stateful_component: 通过组件创建
 * text_children: 子元素为文本
 * array_children: 子元素为数组
 */
export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
  SLOT_CHILDREN = 1 << 4, // 10000
}
