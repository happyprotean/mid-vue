export const extend = Object.assign

export const EMPTY_OBJECT = {}

export function isObject(value) {
  return value && typeof value === 'object'
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue) 
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

// add-foo => addFoo
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toUpperCase() : ''
  })    
}
const capitallize = (str: string) =>  {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitallize(str) : ''
}
