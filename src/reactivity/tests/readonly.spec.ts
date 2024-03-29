import { isProxy, isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  test('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isProxy(original)).toBe(false)
    expect(isProxy(wrapped)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)
    expect(isProxy(original.bar)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isProxy(wrapped.bar)).toBe(true)
  })

  test('warn when call set', () => {
  console.warn = jest.fn()
    const user = readonly({ age: 10 })
    user.age = 1
    expect(console.warn).toHaveBeenCalled()
  })
})
