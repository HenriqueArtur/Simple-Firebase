import { addDoc, type CollectionReference, getDoc } from "firebase/firestore/lite"

import { FactorySimpleDocument } from "../Document/index.js"
import { type SchemaShape } from "../Schema/index.js"
import { type SimpleCollection, type SimpleCollectionBase } from "./collection.js"

export async function Create<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  a_new_data: SimpleCollection<T>["_type"]
) {
  const {
    data,
    id,
    reference
  } = await createInFirebaseAutoId<SimpleCollection<T>["_type"]>(
    a_simple_collection.$COLLECTION,
    a_new_data
  )
  return FactorySimpleDocument(
    a_simple_collection,
    id,
    data,
    reference
  )
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

