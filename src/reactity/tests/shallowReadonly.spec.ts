import { isReadonly, shallowReadonly } from "../reactive"

describe("shallow readonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = {n: { foo: 1 }}
    const observed = shallowReadonly(props)
    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.n)).toBe(false)
  })

  test("warn then call set", () => {
    console.warn = jest.fn()
    const user = shallowReadonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})