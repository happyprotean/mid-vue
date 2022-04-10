import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    get: function (target, key) {
      track(target, key);
      return Reflect.get(target, key);
    },
    set: function (target, key, value) {
      let result = Reflect.set(target, key, value);
      trigger(target, key)
      return result;
    },
  });
}
