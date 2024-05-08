import { FactorySimpleDocument, type SimpleDocument } from "@src/Firestore/Document/index.js"
import { flattenObject } from "@src/Firestore/Helpers.js"
import {
  getASchemaPartial,
  type SchemaShape,
} from "@src/Firestore/Schema/schema.js"
import { type Deep, type ID } from "@src/types.js"
import {
  type CollectionReference,
  doc,
  type DocumentReference,
  getDoc,
  updateDoc
} from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../collection.js"

export async function update<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  a_document: SimpleDocument<T> | ID,
  a_new_data: Deep<SimpleCollection<T>["_type"]>
) {
  const a_schema = getASchemaPartial(a_simple_collection.$SCHEMA)
  const a_data_validated = a_schema.parse(a_new_data)
  const a_data_to_update = flattenObject(a_data_validated)
  if (typeof a_document === "string")
    return await updateWithId(a_simple_collection, a_document, a_data_to_update)
  return await updateWithReference(a_document, a_data_to_update)
}

export async function updateWithId<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  a_document: ID,
  a_new_data: object
) {
  const {
    data,
    id,
    reference
  } = await updateInFirestoreWithId<SimpleCollection<T>["_type"]>(
    a_simple_collection.$COLLECTION,
    a_document,
    a_new_data
  )
  return FactorySimpleDocument(
    a_simple_collection,
    id,
    data,
    reference
  )
}

async function updateInFirestoreWithId<T>(
  a_collection: CollectionReference,
  an_id: ID,
  a_new_data: object,
) {
  const a_doc_ref = doc(a_collection, an_id)
  await updateDoc(a_doc_ref, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    id: a_doc_snap.id,
    data: a_doc_snap.data() as T | undefined,
    reference: a_doc_snap.ref
  }
}

export async function updateWithReference<T extends SchemaShape>(
  a_document: SimpleDocument<T>,
  a_new_data: object
) {
  const {
    id: a_id,
    data: a_data,
    $REFERENCE,
    ...$SIMPLE_DOCUMENT
  } = a_document
  const {
    data,
    id,
    reference
  } = await updateInFirestoreWithReference<SimpleCollection<T>["_type"]>(
    a_document.$REFERENCE,
    a_new_data
  )
  return FactorySimpleDocument(
    $SIMPLE_DOCUMENT,
    id,
    data,
    reference
  )
}

async function updateInFirestoreWithReference<T>(
  a_doc_ref: DocumentReference,
  a_new_data: object
) {
  await updateDoc(a_doc_ref, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    id: a_doc_snap.id,
    data: a_doc_snap.data() as T | undefined,
    reference: a_doc_snap.ref
  }
}
