import { Deep } from "@src/types.js";
import { CollectionReference, Firestore, collection } from "firebase/firestore";
import { AddTimestamps, DateFormat, FirestoreDateDoc } from "./FirestoreTypes.js";
import { SubCollection } from "./SubCollection.js";
import { BuildFunctions, CollectionFunctions } from "./CollectionFunctions.js";

export interface Collection<T extends object, D extends DateFormat>
  extends CollectionFunctions<T, D> {
  path: string;
  subCollections: SubCollection<D>[];
  options: CollectionOptions;
}

export interface CollectionOptions {
  customId: boolean;
  addTimestamps: boolean;
  convertDocTimestampsToDate: boolean;
}

export function BuildCollection<T extends object, D extends DateFormat>(
  aFirestoreRef: Firestore,
  path: string,
  subCollections: SubCollection<D>[],
  options: Deep<CollectionOptions>
): Collection<T, D> {
  const anOptions: CollectionOptions = {
    customId: options.customId ?? false,
    addTimestamps: options.addTimestamps ?? false,
    convertDocTimestampsToDate: options.convertDocTimestampsToDate ?? false
  };
  const COLLECTION = collection(aFirestoreRef, path) as CollectionReference<
    AddTimestamps<T>,
    FirestoreDateDoc<AddTimestamps<T>>
  >;
  return {
    path,
    subCollections,
    options: anOptions,
    ...BuildFunctions<T, D>(COLLECTION, anOptions, subCollections)
  };
}
