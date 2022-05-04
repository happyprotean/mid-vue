import { extend } from '../../src/util'
// activeEffect用于保存当前正在生效的effect
let activeEffect;
// 用于标志当前effect是否需要收集
let shouldTrack;

export function isTracking(){
  return shouldTrack && activeEffect
}

// targetMap: {
//   obj1: {
//     key1: dep[],
//     key2: dep[]
//   },
//   obj2: {
//     key1: dep[],
//     key2: dep[],
//   }
// }
// 用于保存所有响应式对象的依赖
let targetMap = new Map();

class ReactiveEffect {
  private _fn: any;
  public scheduler: Function | undefined;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active){
      return this._fn()
    }
    
    shouldTrack = true
    // 将当前执行的effect保存到全局变量上，便于添加依赖
    activeEffect = this;
    const res = this._fn();
    shouldTrack = false

    return res
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this);
      if (this.onStop) {
        this.onStop()
      }
      this.active = false;
    }
  }
}

function cleanUpEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0
}

export function effect(fn, options: any = {}) {
  let _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options)
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function track(target, key) {
  if (!isTracking()) return

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  
  trackEffects(dep)
}

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  const effect = runner.effect;
  effect.stop();
}
