import { Firestore } from "firebase/firestore";
import { Collection, CollectionOptions } from "./Collection.js";
import { Deep } from "@src/types.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    collection: <T extends object>(
      aCollectionName: string,
      anOptions?: Deep<CollectionOptions>
    ) => {
      const anOptionsFilled = setOptions(anOptions);
      return Collection<T>(aFirestoreRef, aCollectionName, anOptionsFilled);
    }
  };
}

function setOptions(anOptions?: Deep<CollectionOptions>): CollectionOptions {
  if (!anOptions) {
    return {
      customId: false,
      addTimestamps: true,
    }
  }
  return {
    customId: "customId" in anOptions ? (anOptions.customId as boolean) : false,
    addTimestamps: "addTimestamps" in anOptions ? (anOptions.addTimestamps as boolean) : true
  };
};
