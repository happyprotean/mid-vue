import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  test("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    // effect中会自动调用其fn
    expect(nextAge).toBe(11);

    // 当依赖触发时，会再次执行effect中的fn
    user.age++;
    expect(nextAge).toBe(12);
  });
  test("return runner", () => {
    let foo = 1
    let runner = effect(() => {
      foo++
      return 'foo'
    })

    // effect中会自动调用其fn
    expect(foo).toBe(2)

    // 通过runner再次执行effect中的fn，并获取其返回值
    let r = runner()
    expect(foo).toBe(3)
    expect(r).toBe('foo')
  });
  test("scheduler", () => {
    let dummy
    let run;
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      scheduler,
    })

    // scheduler函数不会在effect初始化时调用
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    //  当响应式对象发生更改时，优先调用scheduler
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)

    // 通过runner，手动调用effect中的fn
    run()
    expect(dummy).toBe(2)
  })
});
