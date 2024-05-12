import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js"
import {
  Exist,
  IncludesSome,
  IsEmpty,
  NotExist,
  SizeMoreThanOne
} from "@src/language-functions.js"
import {
  and,
  type CollectionReference,
  limit,
  or,
  orderBy,
  query,
  type QueryConstraint,
  type QueryFilterConstraint,
  Timestamp,
  where
} from "firebase/firestore"

import { formatAKey, formatDirection } from "../Helpers.js"
import { aOperator, isOperator } from "./query-helpers.js"
import { type AnOrderByDirection, type AttributeOperators, type SimpleQuery } from "./query-types.js"

export function formatQuery<T extends object>(
  a_collection: CollectionReference,
  a_query: SimpleQuery<T>
) {
  validateWhere(a_query.where)
  return query(
    a_collection,
    ...[
      ...formatWhere(a_query.where),
      ...formatOrderBy(a_query.orderBy),
      ...formatALimit(a_query.limit)
    ] as QueryConstraint[]
  )
}

function validateWhere(a_where: object) {
  const keys = Object.keys(a_where)
  if (IsEmpty(keys)) throw new SimpleFirebaseFirestoreError('"where" not be empty')
  if (IncludesSome(keys, ["$OR", "$AND"]) && SizeMoreThanOne(keys))
    throw new SimpleFirebaseFirestoreError(
      'When "where" start with "$OR" or "$AND" only accept one of this keys in root of "where".'
    )
}

export function formatWhere(a_where: object, last_key = ""): unknown[] {
  const filters = []
  for (const [key, value] of Object.entries(a_where)) {
    if (key === "$OR") {
      filters.push(or(...formatWhere(value as object) as QueryFilterConstraint[]))
      continue
    }
    if (key === "$AND") {
      filters.push(and(...formatWhere(value as object) as QueryFilterConstraint[]))
      continue
    }
    if (isOperator(key)) {
      filters.push(where(last_key, aOperator(key as AttributeOperators), value))
      continue
    }
    if (Array.isArray(value)) {
      filters.push(where(formatAKey(key, last_key), "array-contains-any", value))
      continue
    }
    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "bigint" ||
      value === null ||
      value instanceof Timestamp
    ) {
      filters.push(where(formatAKey(key, last_key), "==", value))
      continue
    }
    if (typeof value === "object") {
      filters.push(...formatWhere(value as object, formatAKey(key, last_key)))
      continue
    }
  }
  return filters
}

export function formatOrderBy(an_order?: object, last_key = ""): unknown[] {
  if (NotExist(an_order) || IsEmpty(Object.keys(an_order!))) return []
  const order = []
  for (const [key, value] of Object.entries(an_order!)) {
    if (typeof value === "object" && value !== null) {
      order.push(...formatOrderBy(value as object, formatAKey(key, last_key)))
      continue
    }
    order.push(orderBy(formatAKey(key, last_key), formatDirection(value as AnOrderByDirection)))
  }
  return order
}

export function formatALimit(a_limit?: number) {
  return Exist(a_limit) ? [limit(a_limit!)] : []
}
