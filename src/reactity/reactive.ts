import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REAVTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

function createActiveObj(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function reactive(raw) {
  return createActiveObj(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObj(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createActiveObj(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REAVTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY] 
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value) 
}