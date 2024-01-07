import { ID } from "@src/types.js";
import { CollectionReference, Timestamp } from "firebase/firestore/lite";
import { AddTimestamps } from "./FirestoreTypes.js";
import { CollectionFunctions } from "./CollectionFunctions.js";
import { CollectionOptions, SubCollection } from "./Collection.js";

export interface SimpleDocument<T extends object, SC extends Record<string, object> = {}> {
  id: ID;
  data: T;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
  subCollection: (aPath: keyof SC) => CollectionFunctions<SC[keyof SC]>;
}

export function formatSimpleDocument<T extends object, SC extends Record<string, object> = {}>(
  anId: ID,
  aData: AddTimestamps<T>,
  opt: CollectionOptions,
  aParentCollection: CollectionReference
): SimpleDocument<T, SC> {
  const { _createdAt, _updatedAt, ...data } = aData;
  return {
    id: anId,
    data: data as T,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    subCollection: (aPath: keyof SC) =>
      SubCollection<SC[keyof SC]>(aParentCollection, aPath as string, opt)
  };
}
