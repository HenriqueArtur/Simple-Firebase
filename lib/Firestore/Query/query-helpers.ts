import { IsNotEmpty } from "@src/language-functions.js"
import { type OrderByDirection, type WhereFilterOp } from "firebase/firestore"

import { type AnOrderByDirection, type AttributeOperators } from "./query-types.js"
export function flattenObject(
  obj: Record<string, unknown>,
  parent_key = ""
): Record<string, unknown> {
  let result: Record<string, unknown> = {}
  for (const key in obj) {
    const new_key = IsNotEmpty(parent_key) ? `${parent_key}.${key}` : key
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

export function isOperator(key: string) {
  return [
    "$LESS",
    "$LESS_OR_EQ",
    "$EQ",
    "$GREATER_OR_EQ",
    "$GREATER",
    "$ARRAY_CONTAINS",
    "$ARRAY_CONTAINS_ANY",
    "$IN",
    "$NOT_IN",
    "$NOT"
  ].includes(key)
}

export function aOperator(key: AttributeOperators): WhereFilterOp {
  switch (key) {
    case "$LESS":
      return "<"
    case "$LESS_OR_EQ":
      return "<="
    case "$EQ":
      return "=="
    case "$GREATER":
      return ">"
    case "$GREATER_OR_EQ":
      return ">="
    case "$ARRAY_CONTAINS":
      return "array-contains"
    case "$ARRAY_CONTAINS_ANY":
      return "array-contains-any"
    case "$IN":
      return "in"
    case "$NOT_IN":
      return "not-in"
    case "$NOT":
      return "!="
    default:
      throw new Error("Operation not exist")
  }
}


