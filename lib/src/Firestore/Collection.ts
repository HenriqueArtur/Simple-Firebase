import {
  CollectionReference,
  Firestore,
  collection,
} from "firebase/firestore";
import { AddTimestamps, FirestoreDateDoc } from "./FirestoreTypes.js";
import { BuildFunctions } from "./CollectionFunctions.js";

export interface CollectionOptions {
  customId: boolean;
  addTimestamps: boolean;
}

export function Collection<T extends object>(
  aFirestoreRef: Firestore,
  aPath: string,
  anOptions: CollectionOptions
) {
  const aCollection = collection(aFirestoreRef, aPath) as CollectionReference<
    AddTimestamps<T>,
    FirestoreDateDoc<AddTimestamps<T>>
  >;
  return BuildFunctions<T>(aCollection, anOptions);
}

export function SubCollection<T extends object>(
  aParentCollection: CollectionReference,
  aPath: string,
  anOptions: CollectionOptions
) {
  const aCollection = collection(aParentCollection, aPath) as CollectionReference<
    AddTimestamps<T>,
    FirestoreDateDoc<AddTimestamps<T>>
  >;
  return BuildFunctions<T>(aCollection, anOptions);
}
