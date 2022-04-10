// activeEffect用于保存当前正在生效的effect
let activeEffect

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
let targetMap = new Map()


class ReactiveEffect {
  private _fn: any
  constructor(fn){
    this._fn = fn
  }
  run(){
    // 将当前执行的effect保存到全局变量上，便于添加依赖
    activeEffect = this
    this._fn()
  }
}


export function effect(fn) {
  let _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect
}

export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap){
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)
  if (!deps){
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(activeEffect)
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let deps = depsMap.get(key)
  for (const dep of deps) {
    dep.run() 
  }
}