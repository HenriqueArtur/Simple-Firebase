import { ID } from "@src/types.js";
import { DBDocument, DocFormat, FirestoreDoc, OptState, TimestampsData } from "./FirestoreTypes.js";

export function formatData<T extends object, O extends OptState<"TIMESTAMP">>(
  anId: ID,
  aData: DocFormat<T, O>,
  addTimestamps?: boolean
) {
  if (addTimestamps) {
    const aDataWithTimestamp = aData as FirestoreDoc<T> & TimestampsData;
    return {
      _id: anId,
      ...aDataWithTimestamp,
      _createdAt: aDataWithTimestamp._createdAt.toDate(),
      _updatedAt: aDataWithTimestamp._updatedAt.toDate()
    } as DBDocument<T, O>;
  }
  const aDataWithoutTimestamp = aData as FirestoreDoc<T>;
  return {
    _id: anId,
    ...aDataWithoutTimestamp
  } as DBDocument<T, O>;
}
