import { reactive } from '../reactive'
describe("reactive", () => {
  test("happy path", () => {
    const original = { foo: 11 }
    const observed = reactive(original) 
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(11)
  })
})