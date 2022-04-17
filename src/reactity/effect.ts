// activeEffect用于保存当前正在生效的effect
let activeEffect;

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
  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 将当前执行的effect保存到全局变量上，便于添加依赖
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      clearEffect(this);
      this.active = false;
    }
  }
}

function clearEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}

export function effect(fn, options: any = {}) {
  let _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function track(target, key) {
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

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
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
