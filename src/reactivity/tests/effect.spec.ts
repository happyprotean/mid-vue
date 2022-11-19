import { reactive } from '../reactive'
import { effect, stop } from '../effect'
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

  test("scheduler", () => {
    let dummy
    let run
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    // should be called on first trigger
    obj.foo++
    expect(scheduler).toBeCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manully run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  test("stop", () => {
    let dummy
    let obj = reactive({ foo: 1 }) 
    let runner = effect(() => {
      dummy = obj.foo
    })
    expect(dummy).toBe(1)
    obj.foo = 2
    expect(dummy).toBe(2)

    stop(runner)
    obj.foo = 3
    expect(dummy).toBe(2)

    // stoped effect should still be manully callable
    runner()
    expect(dummy).toBe(3)
  })
  
  test('onStop', () => { 
    const obj = reactive({ foo: 1 })
    const onStop = jest.fn()
    let dummy
    let runner = effect(() => {
      dummy = obj.foo
    }, { onStop })

    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
   })


})