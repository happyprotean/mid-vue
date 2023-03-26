export const extend = Object.assign

export function isObject(value) {
  return value && typeof value === 'object'
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue) 
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
