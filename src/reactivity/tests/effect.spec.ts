import { reactive } from '../reactive'
import { effect } from '../effect'
describe("effect", () => {
  test("happy path", () => {
    const user = reactive({
      age: 10,
    })
    let newAge
    effect(() => {
      newAge = user.age + 1
    })
    expect(newAge).toBe(11)
    
    // update
    user.age++
    expect(newAge).toBe(12)
  })

  test("should return runner when call effect", () => {
    // effect(fn) -> runner function  -> runner() -> return
    let foo = 10
    let runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    let res = runner()
    expect(foo).toBe(12)
    expect(res).toBe('foo')
  })
})