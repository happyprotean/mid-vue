import { reactive, readonly, isReactive, isProxy } from "../reactive";
describe("reactive", () => {
  test("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observed)).toBe(true);
  });

  test("warn then call set", () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })

  test("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 1 }]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })
});
