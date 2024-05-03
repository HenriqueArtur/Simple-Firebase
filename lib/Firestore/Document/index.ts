import { type ID } from "@src/types.js"
import { type DocumentReference } from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/index.js"

export interface SimpleDocument<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly id: ID
  readonly data: SimpleCollection<T>["_type"]
  readonly $REFERENCE: DocumentReference
}

export function FactorySimpleDocument<T extends SchemaShape>(
  a_collection: SimpleCollection<T>,
  a_id: ID,
  a_document_data: SimpleCollection<T>["_type"],
  a_reference: DocumentReference
): SimpleDocument<T> {
  return {
    ...a_collection,
    $REFERENCE: a_reference,
    data: a_document_data,
    id: a_id,
  }
}
