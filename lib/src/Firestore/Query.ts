import { CollectionReference, Timestamp, and, or, query, where } from "firebase/firestore";
import { AttributeOperators, SimpleQuery } from "./QueryTypes.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { aOperator, formatAKey, isOperator } from "./Helpers.js";

export function formatQuery<T extends object>(
  aCollection: CollectionReference,
  aQuery: SimpleQuery<T>
) {
  validateWhere(aQuery.where);
  return query(aCollection, ...[...formatWhere(aQuery.where)]);
}

function validateWhere(aWhere: object) {
  const keys = Object.keys(aWhere);
  if (keys.length == 0) {
    throw new SimpleFirebaseFirestoreError('"where" not be empty');
  }
  if ((keys.includes("$OR") || keys.includes("$AND")) && keys.length > 1) {
    throw new SimpleFirebaseFirestoreError(
      'When "where" start with "$OR" or "$AND" only accept one of this keys in root of "where".'
    );
  }
}

function formatWhere(aWhere: object, lastKey = ""): any[] {
  let filters = [];
  for (const [key, value] of Object.entries(aWhere)) {
    if (key == "$OR") {
      filters.push(or(...formatWhere(value)));
      continue;
    }
    if (key == "$AND") {
      filters.push(and(...formatWhere(value)));
      continue;
    }
    if (isOperator(key)) {
      filters.push(where(lastKey, aOperator(key as AttributeOperators), value));
      continue;
    }
    if (Array.isArray(value)) {
      filters.push(where(formatAKey(key, lastKey), "array-contains-any", value));
      continue;
    }
    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "number" ||
      typeof value === "bigint" ||
      value === null ||
      value instanceof Timestamp
    ) {
      filters.push(where(formatAKey(key, lastKey), "==", value));
      continue;
    }
    if (typeof value === "object") {
      filters.push(...formatWhere(value, formatAKey(key, lastKey)));
      continue;
    }
  }
  return filters;
}
