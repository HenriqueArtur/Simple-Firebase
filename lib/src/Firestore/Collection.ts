import { CollectionReference, Firestore, collection } from "firebase/firestore";
import { BuildFunctions } from "./CollectionFunctions.js";
import { Deep } from "@src/types.js";

export interface CollectionOptions {
  customId: boolean;
  addTimestamps: boolean;
}

export function Collection<T extends object, SC extends Record<string, object> = {}>(
  aFirestoreRef: Firestore,
  aPath: string,
  anOptions: CollectionOptions
) {
  return BuildFunctions<T, SC>(collection(aFirestoreRef, aPath), anOptions);
}

export function SubCollection<T extends object, SC extends Record<string, object> = {}>(
  aParentCollection: CollectionReference,
  aPath: string,
  anOptions: CollectionOptions
) {
  return BuildFunctions<T, SC>(collection(aParentCollection, aPath), anOptions);
}

/* HANDLERS */
export function setOptions(anOptions?: Deep<CollectionOptions>): CollectionOptions {
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
