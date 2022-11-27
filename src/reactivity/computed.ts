import { ReactiveEffect } from './effect'

class ComputedRefImp {
  private _dirty: Boolean = true
  private _value: any
  private _effect: any
  constructor(getter) {
    // 不要触发依赖，而是触发scheduler，告诉computed，下次取值时，需要重新计算
    this._effect = new ReactiveEffect(getter, () => {
      this._dirty = true
    })
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImp(getter)
}
