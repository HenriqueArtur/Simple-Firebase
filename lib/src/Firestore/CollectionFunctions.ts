import {
  CollectionReference,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { CollectionOptions } from "./Collection.js";
import { AddTimestamps, DateFormat, FirestoreDateDoc } from "./FirestoreTypes.js";
import { SubCollection } from "./SubCollection.js";
import { ID } from "@src/types.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { formatData } from "./helpers.js";
import { SimpleDocument } from "./SimpleDocument.js";

export interface CollectionFunctions<T extends object, D extends DateFormat> {
  create: (aData: T, customId?: ID) => Promise<SimpleDocument<T, D>>;
  delete: (anId: ID) => Promise<void>;
  find: () => Promise<SimpleDocument<T, D>[]>;
  findById: (anId: ID) => Promise<SimpleDocument<T, D>>;
  update: (anId: ID, newData: any) => Promise<SimpleDocument<T, D>>;
}

export function BuildFunctions<T extends object, D extends DateFormat>(
  aCollection: CollectionReference<AddTimestamps<T>, FirestoreDateDoc<AddTimestamps<T>>>,
  anOptions: CollectionOptions,
  subCollections: SubCollection<D>[]
): CollectionFunctions<T, D> {
  return {
    create: async (aData: T, customId?: ID) => {
      if (anOptions.customId && !customId) {
        throw new SimpleFirebaseFirestoreError(
          '"customId" is needed if option "customId" was enabled.'
        );
      }
      if (
        (!("customId" in anOptions) && customId) ||
        ("customId" in anOptions && anOptions.customId == false && customId)
      ) {
        throw new SimpleFirebaseFirestoreError(
          '"customId" is not needed if option "customId" was disabled.'
        );
      }

      const aDataToCreate = anOptions.addTimestamps
        ? {
            ...aData,
            _createdAt: serverTimestamp(),
            _updatedAt: serverTimestamp()
          }
        : aData;

      if (customId) {
        const aDocRef = doc(aCollection, customId);
        const aPreDocSnap = await getDoc(aDocRef);
        if (aPreDocSnap.exists()) {
          throw new SimpleFirebaseFirestoreError(`Document "${customId}" already exists.`);
        }
        await setDoc(aDocRef, aDataToCreate);
        const aDocSnap = await getDoc(aDocRef);
        const aNewData = aDocSnap.data() as AddTimestamps<T>;
        return formatData(aDocSnap.id, aNewData, anOptions, aCollection, subCollections);
      }
      const aDocRef = await addDoc(aCollection, aDataToCreate);
      const aDocSnap = await getDoc(aDocRef);
      const aNewData = aDocSnap.data() as AddTimestamps<T>;
      return formatData(aDocSnap.id, aNewData, anOptions, aCollection, subCollections);
    },
    delete: async (_anId: ID) => {
      throw new Error("Not Implemented!");
    },
    find: async () => {
      throw new Error("Not Implemented!");
    },
    findById: async (_anId: ID) => {
      throw new Error("Not Implemented!");
    },
    update: async (_anId: ID, _newData: any) => {
      throw new Error("Not Implemented!");
    }
  };
}
