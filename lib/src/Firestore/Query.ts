import {
  CollectionReference,
  Timestamp,
  WhereFilterOp,
  and,
  or,
  query,
  where
} from "firebase/firestore";
import { AttributeOperators, SimpleQuery, Where } from "./QueryTypes.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";

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

function formatWhere(aWhere: object): any[] {
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
    if (value instanceof Timestamp || typeof value != "object") {
      filters.push(where(key, "==", value));
      continue;
    }
  }
  return filters;
}

function aOperator(key: AttributeOperators): WhereFilterOp {
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
