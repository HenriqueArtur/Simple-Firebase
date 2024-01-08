import { Firestore } from "firebase/firestore";
import { Collection, CollectionOptions, setOptions } from "./Collection.js";
import { Deep } from "@src/types.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    collection: <T extends object, SC extends Record<string, object> = {}>(
      aCollectionName: string,
      anOptions?: Deep<CollectionOptions>
    ) => {
      const anOptionsFilled = setOptions(anOptions);
      return Collection<T, SC>(aFirestoreRef, aCollectionName, anOptionsFilled);
    }
  };
}
