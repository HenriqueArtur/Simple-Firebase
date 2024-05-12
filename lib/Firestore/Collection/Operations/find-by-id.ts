import { FactorySimpleDocument } from "@src/Firestore/Document/document.js"
import { type SchemaShape } from "@src/Firestore/Schema/schema.js"
import { type ID } from "@src/types.js"
import { type CollectionReference, doc, getDoc } from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../collection.js"


export async function findById<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  an_id: ID
) {
  const {
    data,
    id,
    reference
  } = await findByIdFirestore<SimpleCollection<T>["_type"]>(
    a_simple_collection.$COLLECTION,
    an_id
  )
  return FactorySimpleDocument(
    a_simple_collection,
    id,
    data,
    reference
  )
}

async function findByIdFirestore<T>(
  a_collection: CollectionReference,
  an_id: ID
) {
  const a_doc_ref = doc(a_collection, an_id)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    data: a_doc_snap.data() as T | undefined,
    id: a_doc_snap.id,
    reference: a_doc_snap.ref
  }
}
