import { ID } from "@src/types.js";
import { CollectionReference, Timestamp } from "firebase/firestore";
import { SimpleDocument } from "./SimpleDocument.js";
import { CollectionOptions } from "./Collection.js";
import { SubCollection } from "./SubCollection.js";
import { AddTimestamps, DateFormat, FirestoreDateDoc } from "./FirestoreTypes.js";

export function formatData<T extends object, D extends DateFormat>(
  anId: ID,
  aData: AddTimestamps<T>,
  opt: CollectionOptions,
  parentCollection: CollectionReference<T, FirestoreDateDoc<T>>,
  subCollections: SubCollection<D>[]
): SimpleDocument<T, D> {
  const { _createdAt, _updatedAt, ...data } = aData;
  const aDataToReturn = opt.convertDocTimestampsToDate ? parseTimestampToDate(data) : data;
  return {
    id: anId,
    data: aDataToReturn as T,
    subCollection: subCollections.map((sc) => sc.build(parentCollection, anId, opt)),
    createdAt: _createdAt,
    updatedAt: _updatedAt
  };
}

function parseTimestampToDate(aData: any): any {
  if (Array.isArray(aData)) {
    return aData.map((v) => parseTimestampToDate(v));
  }
  if (aData instanceof Timestamp) {
    return aData.toDate();
  }
  if (
    typeof aData == "bigint" ||
    typeof aData == "boolean" ||
    typeof aData == "function" ||
    typeof aData == "number" ||
    typeof aData == "string" ||
    typeof aData == "symbol" ||
    typeof aData == "undefined" ||
    aData == null
  ) {
    return aData;
  }
  for (const [key, value] of Object.entries(aData)) {
    if (value instanceof Timestamp) {
      aData[key] = value.toDate();
      continue;
    }
    if (Array.isArray(value)) {
      aData[key] = value.map((v) => parseTimestampToDate(v));
      continue;
    }
    if (typeof value == "object") {
      aData[key] = parseTimestampToDate(value);
      continue;
    }
  }
  return aData;
}
