import {
  CollectionReference,
  DocumentData,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { CollectionOptions } from "./Collection.js";
import { AddTimestamps, FirestoreDate, QueryResult } from "./FirestoreTypes.js";
import { Deep, ID } from "@src/types.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { SimpleDocument, formatSimpleDocument } from "./SimpleDocument.js";
import { flattenObject } from "./Helpers.js";
import { SimpleQuery } from "./QueryTypes.js";
import { formatQuery } from "./Query.js";

/* MAIN */
export interface CollectionFunctions<T extends object, SC extends Record<string, object> = {}> {
  create: (aData: FirestoreDate<T>, customId?: ID) => Promise<SimpleDocument<T, SC>>;
  delete: (anId: ID) => Promise<void>;
  find: (aQuery: SimpleQuery<T>) => Promise<QueryResult<T, SC>>;
  findById: (anId: ID) => Promise<SimpleDocument<T, SC> | undefined>;
  update: (anId: ID, newData: Deep<FirestoreDate<T>>) => Promise<SimpleDocument<T, SC>>;
}

export function BuildFunctions<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions
): CollectionFunctions<T, SC> {
  return {
    create: async (aData: FirestoreDate<T>, customId?: ID) =>
      create<T, SC>(aCollection, anOptions, aData, customId),
    delete: async (anId: ID) => hardDelete(aCollection, anId),
    find: async (aQuery: SimpleQuery<T>) => find(aCollection, anOptions, aQuery),
    findById: async (anId: ID) => findById<T, SC>(aCollection, anOptions, anId),
    update: async (anId: ID, newData: Deep<FirestoreDate<T>>) =>
      update<T, SC>(aCollection, anOptions, anId, newData)
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

async function hardDelete(aCollection: CollectionReference, anId: ID) {
  await deleteDoc(doc(aCollection, anId));
}

async function find<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions,
  aQuery: SimpleQuery<T>
): Promise<QueryResult<T, SC>> {
  const docsList = await getDocs(formatQuery<T>(aCollection, aQuery));
  return {
    length: docsList.docs.length,
    page: 0,
    offset: 0,
    docs: docsList.docs.map((d) =>
      formatSimpleDocument<T, SC>(d.id, d.data() as AddTimestamps<T>, anOptions, aCollection)
    )
  };
}

async function findById<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions,
  anId: ID
) {
  const aDocRef = doc(aCollection, anId);
  const aDocSnap = await getDoc(aDocRef);
  if (!aDocSnap.exists()) {
    return undefined;
  }
  const aNewData = aDocSnap.data() as AddTimestamps<T>;
  return formatSimpleDocument<T, SC>(aDocSnap.id, aNewData, anOptions, aCollection);
}

async function update<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions,
  anId: ID,
  aData: Deep<FirestoreDate<T>>
) {
  const aDataToUpdate = anOptions.addTimestamps
    ? {
        ...aData,
        _updatedAt: serverTimestamp()
      }
    : aData;
  const aDocRef = doc(aCollection, anId);
  await updateDoc(aDocRef, flattenObject(aDataToUpdate));
  const aDocSnap = await getDoc(aDocRef);
  const aDocUpdated = aDocSnap.data() as AddTimestamps<T>;
  return formatSimpleDocument<T, SC>(aDocSnap.id, aDocUpdated, anOptions, aCollection);
}
