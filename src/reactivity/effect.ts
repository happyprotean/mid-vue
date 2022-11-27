import { extend } from '../shared'

// 全局变量，用于保存当前effect，便于收集依赖
let activeEffect
let shouldTrack = false
const targetMap = new Map()

class ReactiveEffect {
  private _fn: any
  public scheduler: Function | undefined
  deps = []
  active = true
  onStop?: () => void

  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    // effect被stop
    if (!this.active) {
      return this._fn()
    }

    // effect未被stop
    activeEffect = this
    shouldTrack = true
    const res = this._fn()
    shouldTrack = false
    return res
  }

  stop() {
    if(this.active) {
      cleanupEffect(this)
      if (this.onStop) this.onStop()
      this.active = false
    }
  }
}

export function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}


export function track(target, key) {
  if (!isTracking()) return

  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    // 依赖可以有多个，为避免重复，使用Set数据结构
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key) 
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  if (!dep) return
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run() 
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(activeEffect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  // 获取挂载的effect实例
  runner.effect.stop()
}