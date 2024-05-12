import { type OrderByDirection } from "firebase/firestore"

import { type AnOrderByDirection } from "./Query/query-types.js"

const IS_EMPTY = 0

export function flattenObject(
  obj: Record<string, unknown>,
  parent_key = ""
): Record<string, unknown> {
  let result: Record<string, unknown> = {}
  for (const key in obj) {
    const new_key = (parent_key.length > IS_EMPTY) ? `${parent_key}.${key}` : key
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nested_object = flattenObject(obj[key] as Record<string, unknown>, new_key)
      result = { ...result, ...nested_object }
      continue
    }
    result[new_key] = obj[key]
  }
  return result
}

export function formatAKey(current_key: string, last_key: string) {
  return last_key === "" ? current_key : `${last_key}.${current_key}`
}

export function formatDirection(value: AnOrderByDirection) {
  return value.toLowerCase() as OrderByDirection
}
