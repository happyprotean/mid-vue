import { isReadonly, readonly, isProxy } from "../reactive";

describe("readonly", () => {
  test("should make nested values readonly", () => {
    const original = { foo: 1, bar: { bar: 1 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReadonly(original.bar)).toBe(false);
    expect(isProxy(wrapped)).toBe(true);
  });

  test("warn then call set", () => {
    console.warn = jest.fn()
    const user = readonly({
      age: 10,
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
});