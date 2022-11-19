// 全局变量，用于保存当前effect，便于收集依赖
let activeEffect

class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    const res = this._fn()
    return res
  }
}

const targetMap = new Map()

export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if (!deps) {
    // 依赖可以有多个，为避免重复，使用Set数据结构
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let deps = depsMap.get(key) 
  if (!deps) return
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run() 
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(activeEffect)
  return runner
}