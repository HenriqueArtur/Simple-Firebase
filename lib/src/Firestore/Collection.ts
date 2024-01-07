import { CollectionReference, Firestore, collection } from "firebase/firestore";
import { BuildFunctions } from "./CollectionFunctions.js";

export interface CollectionOptions {
  customId: boolean;
  addTimestamps: boolean;
}

export function Collection<T extends object, SC extends Record<string, object> = {}>(
  aFirestoreRef: Firestore,
  aPath: string,
  anOptions: CollectionOptions
) {
  const aCollection = collection(aFirestoreRef, aPath);
  return BuildFunctions<T, SC>(aCollection, anOptions);
}

export function SubCollection<T extends object, SC extends Record<string, object> = {}>(
  aParentCollection: CollectionReference,
  aPath: string,
  anOptions: CollectionOptions
) {
  const aCollection = collection(aParentCollection, aPath);
  return BuildFunctions<T, SC>(aCollection, anOptions);
}
