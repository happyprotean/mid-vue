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
    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });
  test("return runner", () => {
    let foo = 1
    let runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(2)
    let r = runner()
    expect(foo).toBe(3)
    expect(r).toBe('foo')
  })
});
