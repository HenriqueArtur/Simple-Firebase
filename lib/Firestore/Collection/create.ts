import { type ID } from "@src/types.js"
import { doc, setDoc } from "firebase/firestore"
import { addDoc, type CollectionReference, getDoc } from "firebase/firestore/lite"

import { FactorySimpleDocument } from "../Document/index.js"
import { type SchemaShape } from "../Schema/index.js"
import { type SimpleCollection, type SimpleCollectionBase } from "./collection.js"

export interface CreateCustomOptions {
  custom_id?: ID
}

export async function Create<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  a_new_data: SimpleCollection<T>["_type"],
  a_custom_options?: CreateCustomOptions
) {
  const a_new_data_parsed = a_simple_collection.$SCHEMA.parse(a_new_data)
  const {
    data,
    id,
    reference
  } = await createInFirebase<SimpleCollection<T>["_type"]>(
    a_simple_collection.$COLLECTION,
    a_new_data_parsed,
    a_custom_options
  )
  return FactorySimpleDocument(
    a_simple_collection,
    id,
    data,
    reference
  )
}

export async function createInFirebase<T>(
  a_collection: CollectionReference,
  a_new_data: object,
  a_custom_options?: CreateCustomOptions
) {
  if (a_custom_options?.custom_id !== undefined)
    return await
      createInFirebaseCustomId<T>(
        a_collection,
        a_new_data,
        a_custom_options.custom_id)
  return await
    createInFirebaseAutoId<T>(a_collection, a_new_data)
}

export async function createInFirebaseAutoId<T>(
  a_collection: CollectionReference,
  a_new_data: object
) {
  const a_doc_ref = await addDoc(a_collection, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    data: a_doc_snap.data() as T | undefined,
    id: a_doc_snap.id,
    reference: a_doc_snap.ref
  }
}

export async function createInFirebaseCustomId<T>(
  a_collection: CollectionReference,
  a_new_data: object,
  custom_id: ID
) {
  const a_doc_ref = doc(a_collection, custom_id)
  await setDoc(a_doc_ref, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    data: a_doc_snap.data() as T | undefined,
    id: a_doc_snap.id,
    reference: a_doc_snap.ref
  }
}

