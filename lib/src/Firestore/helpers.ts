import { ID } from "@src/types.js";
import { DBDocument, DocFormatFirestore, OptState } from "./FirestoreTypes.js";
import { Timestamp } from "firebase/firestore";

export function formatData<T extends object, O extends OptState<"TIMESTAMP">>(
  anId: ID,
  aData: DocFormatFirestore<T, O>
): DBDocument<T, O> {
  return {
    _id: anId,
    ...parseTimestampToDate(aData)
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
