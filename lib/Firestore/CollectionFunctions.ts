import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { type Deep, type ID } from "@src/types.js";
import {
  addDoc,
  type CollectionReference,
  deleteDoc,
  doc,
  type DocumentData,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";

import { type FirestoreDate, type QueryResult, type QueryResultData } from "./FirestoreTypes.js";
import { flattenObject } from "./Helpers.js";
import { defineACursor, NextPage } from "./Pagination.js";
import { formatQuery } from "./Query.js";
import { type SimpleQuery } from "./QueryTypes.js";
import { formatSimpleDocument, type SimpleDocument } from "./SimpleDocument.js";

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
): CollectionFunctions<T, SC> {
  return {
    create: async (aData: FirestoreDate<T>, customId?: ID) =>
      await create<T, SC>(aCollection, aData, customId),
    delete: async (anId: ID) => { await hardDelete(aCollection, anId); },
    find: async (aQuery: SimpleQuery<T>) => await find(aCollection, aQuery),
    findById: async (anId: ID) => await findById<T, SC>(aCollection, anId),
    update: async (anId: ID, newData: Deep<FirestoreDate<T>>) =>
      await update<T, SC>(aCollection, anId, newData)
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
    return formatSimpleDocument<T, SC>(aDocSnap, anOptions, aCollection);
  }
  const aDocRef = await addDoc<DocumentData, DocumentData>(aCollection, aDataToCreate);
  const aDocSnap = await getDoc(aDocRef);
  return formatSimpleDocument<T, SC>(aDocSnap, anOptions, aCollection);
}

async function hardDelete(aCollection: CollectionReference, anId: ID) {
  await deleteDoc(doc(aCollection, anId));
}

async function find<T extends object, SC extends Record<string, object> = {}>(
  aCollection: CollectionReference,
  anOptions: CollectionOptions,
  aQuery: SimpleQuery<T>
): Promise<QueryResult<T, SC>> {
  const currentQuery = formatQuery<T>(aCollection, aQuery);
  const docsList = await getDocs(currentQuery);
  const aCursor = defineACursor(docsList);
  const docsFoundUntilNow = docsList.docs.length;
  const page = 0;
  const limit = aQuery.limit ?? "ALL";
  const isLastPage = limit == "ALL" || docsList.docs.length < limit;
  const aResult: QueryResultData<T, SC> = {
    docsFoundUntilNow,
    page,
    limit,
    isLastPage,
    docs: docsList.docs.map((d) => formatSimpleDocument<T, SC>(d, anOptions, aCollection))
  };
  return {
    ...aResult,
    nextPage: async () =>
      await NextPage(currentQuery, docsFoundUntilNow, page, limit, aCursor, aCollection, anOptions)
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
  return formatSimpleDocument<T, SC>(aDocSnap, anOptions, aCollection);
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
  return formatSimpleDocument<T, SC>(aDocSnap, anOptions, aCollection);
}
