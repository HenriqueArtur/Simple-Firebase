import { type OrderByDirection, type WhereFilterOp } from "firebase/firestore";

import { type AnOrderByDirection, type AttributeOperators } from "./QueryTypes.js";

export function flattenObject(obj: Record<string, any>, parentKey = ""): Record<string, any> {
  let result: Record<string, any> = {};
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nestedObject = flattenObject(obj[key], newKey);
      result = { ...result, ...nestedObject };
      continue;
    }
    result[newKey] = obj[key];
  }
  return result;
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
  ].includes(key);
}

export function aOperator(key: AttributeOperators): WhereFilterOp {
  switch (key) {
    case "$LESS":
      return "<";
    case "$LESS_OR_EQ":
      return "<=";
    case "$EQ":
      return "==";
    case "$GREATER":
      return ">";
    case "$GREATER_OR_EQ":
      return ">=";
    case "$ARRAY_CONTAINS":
      return "array-contains";
    case "$ARRAY_CONTAINS_ANY":
      return "array-contains-any";
    case "$IN":
      return "in";
    case "$NOT_IN":
      return "not-in";
    case "$NOT":
      return "!=";
  }
}

export const formatAKey = (currentKey: string, lastKey: string) =>
  lastKey == "" ? currentKey : `${lastKey}.${currentKey}`;

export function formatDirection(value: AnOrderByDirection) {
  return value.toLowerCase() as OrderByDirection;
}
