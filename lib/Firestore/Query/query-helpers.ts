import { type WhereFilterOp } from "firebase/firestore"

import { type AttributeOperators } from "./query-types.js"

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


