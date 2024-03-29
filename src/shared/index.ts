export const extend = Object.assign

export * from './toDisplayString'

export const EMPTY_OBJ = {}

export function isObject(value) {
  return value && typeof value === 'object'
}

export const isString = (value) => typeof value === 'string'

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue)
}

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key)

// add-foo => addFoo
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })
}
const capitallize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitallize(str) : ''
}
