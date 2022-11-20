import { shallowReadonly, isReadonly } from '../reactive'
describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: {age: 1} }) 
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
  })

  test('warn when call set', () => {
    console.warn = jest.fn()
      const user = shallowReadonly({ age: 10 })
      user.age = 1
      expect(console.warn).toHaveBeenCalled()
    })
})