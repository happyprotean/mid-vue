import { getCurrentInstance } from './component'

export function provide(key, value) {
  const currentInstance = getCurrentInstance() as any
  if (currentInstance) {
    let { provides } = currentInstance
    // App根组件无parent
    if (currentInstance.parent) {
      const parentProvides = currentInstance.parent.provides
      // 只能执行一次，在初始化是会将父组件的provides赋值给当前组件
      if (provides === parentProvides) {
        provides = currentInstance.provides = Object.create(parentProvides)
      }
    }
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    if (!currentInstance.parent) {
      console.warn('根组件无父元素')
      return
    }
    const parentProvides = currentInstance.parent.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else if (typeof defaultValue === 'function') {
      return defaultValue()
    } else {
      return defaultValue
    }
  }
}
