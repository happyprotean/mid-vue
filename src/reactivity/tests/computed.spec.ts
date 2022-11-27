import { computed } from '../computed'
import { reactive } from '../reactive'

describe("computed", () => {
  test("happy path", () => {
    const uesr = reactive({
      age: 1,
    })
    const age = computed(() => {
      return uesr.age
    })
    expect(age.value).toBe(1)
  })
  
  test("should compute lazily", () => {
    const value = reactive({
      foo: 1,
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now should computed
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)
  })
})