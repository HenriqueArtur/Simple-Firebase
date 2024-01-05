import { ID } from "@src/types.js";
import { CollectionReference, Timestamp } from "firebase/firestore/lite";
import { AddTimestamps } from "./FirestoreTypes.js";
import { CollectionFunctions } from "./CollectionFunctions.js";
import { CollectionOptions, SubCollection } from "./Collection.js";

export interface SimpleDocument<T extends object> {
  id: ID;
  data: T;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
  subCollection: <SC extends object>(path: string) => CollectionFunctions<SC>;
}

export function formatSimpleDocument<T extends object>(
  anId: ID,
  aData: AddTimestamps<T>,
  opt: CollectionOptions,
  aParentCollection: CollectionReference
): SimpleDocument<T> {
  const { _createdAt, _updatedAt, ...data } = aData;
  return {
    id: anId,
    data: data as T,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    subCollection: <SC extends object>(aPath: string) =>
      SubCollection<SC>(aParentCollection, aPath, opt)
  };
}
