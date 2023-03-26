import { camelize, toHandlerKey } from "../shared/index"

export function emit(instance, event, ...rest) {
  const { props } = instance
  const handler = props[toHandlerKey(camelize(event))]
  handler && handler(...rest)
}