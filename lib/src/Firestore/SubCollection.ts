import { ID } from "@src/types.js";
import { CollectionReference, collection } from "firebase/firestore";
import { Collection, CollectionOptions } from "./Collection.js";
import { BuildFunctions } from "./CollectionFunctions.js";
import { AddTimestamps, DateFormat, FirestoreDateDoc } from "./FirestoreTypes.js";

export class SubCollection<D extends DateFormat, T extends object = {}> {
  path: string;
  subCollections: SubCollection<DateFormat>[];

  constructor(path: string, subCollections: SubCollection<D>[] = []) {
    this.path = path;
    this.subCollections = subCollections;
  }

  build(aParentCollection: CollectionReference, aParentId: ID, options: CollectionOptions) {
    return BuildSubCollection<T, D>(
      aParentCollection,
      aParentId,
      this.path,
      this.subCollections,
      options
    );
  }
}

export function BuildSubCollection<T extends object, D extends DateFormat>(
  aParentCollection: CollectionReference,
  aParentId: ID,
  path: string,
  subCollections: SubCollection<D>[],
  options: CollectionOptions
): Collection<T, D> {
  const COLLECTION = collection(aParentCollection, aParentId, path) as CollectionReference<
    AddTimestamps<T>,
    FirestoreDateDoc<AddTimestamps<T>>
  >;
  return {
    path,
    subCollections,
    options,
    ...BuildFunctions<T, D>(COLLECTION, options, subCollections)
  };
}
