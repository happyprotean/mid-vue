import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
  return function (target, key) {
    if (!isReadonly) {
      track(target, key);
    }
    if (key === ReactiveFlags.IS_REAVTIVE){
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    return Reflect.get(target, key);
  };
}

function createSetter() {
  return function (target, key, value) {
    let result = Reflect.set(target, key, value);
    trigger(target, key);
    return result;
  };
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: function(target, key){
    console.warn(`key: ${key}不能被赋值，因为target为readonly`, target)
    return true
  }
}