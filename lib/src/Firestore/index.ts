import { Firestore } from "firebase/firestore";
import { BuildCollection, CollectionOptions } from "./Collection.js";
import { DateFormat } from "./FirestoreTypes.js";
import { SubCollection } from "./SubCollection.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    collection: <T extends object, D extends DateFormat = "USE_DATE">(
      aCollectionName: string,
      aSubCollections: SubCollection<D>[],
      anOptions: CollectionOptions
    ) => {
      return BuildCollection<T, D>(aFirestoreRef, aCollectionName, aSubCollections, anOptions);
    },
    collectionWithSchema: (_modelName: string, _schema: any, _options = {}) => {
      throw new Error("Not implemented!");
    }
  };
}
