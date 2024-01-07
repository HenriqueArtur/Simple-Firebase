import {
  CollectionReference,
  DocumentData,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { CollectionOptions } from "./Collection.js";
import { AddTimestamps, FirestoreDate } from "./FirestoreTypes.js";
import { ID } from "@src/types.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { SimpleDocument, formatSimpleDocument } from "./SimpleDocument.js";

/* MAIN */
export interface CollectionFunctions<T extends object, SC extends Record<string, object> = {}> {
  create: (aData: FirestoreDate<T>, customId?: ID) => Promise<SimpleDocument<T, SC>>;
  delete: (anId: ID) => Promise<void>;
  find: () => Promise<SimpleDocument<T, SC>[]>;
  findById: (anId: ID) => Promise<SimpleDocument<T, SC>>;
  update: (anId: ID, newData: any) => Promise<SimpleDocument<T, SC>>;
}

export function BuildFunctions<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions
): CollectionFunctions<T> {
  return {
    create: async (aData: FirestoreDate<T>, customId?: ID) =>
      create<T, SC>(aCollection, anOptions, aData, customId),
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

/* ++!!++ FUNCTIONS ++!!++ */
async function create<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions,
  aData: FirestoreDate<T>,
  customId?: ID
) {
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
    await setDoc<DocumentData, DocumentData>(aDocRef, aDataToCreate);
    const aDocSnap = await getDoc(aDocRef);
    const aNewData = aDocSnap.data() as AddTimestamps<T>;
    return formatSimpleDocument<T, SC>(aDocSnap.id, aNewData, anOptions, aCollection);
  }
  const aDocRef = await addDoc<DocumentData, DocumentData>(aCollection, aDataToCreate);
  const aDocSnap = await getDoc(aDocRef);
  const aNewData = aDocSnap.data() as AddTimestamps<T>;
  return formatSimpleDocument<T, SC>(aDocSnap.id, aNewData, anOptions, aCollection);
}