import { type ID } from "@src/types.js"
import { type DocumentReference } from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/schema.js"

export interface SimpleDocument<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly id: ID
  readonly data: () => SimpleCollection<T>["_type"] | undefined
  readonly $REFERENCE: DocumentReference
}

export function FactorySimpleDocument<T extends SchemaShape>(
  a_collection: SimpleCollectionBase<T>,
  a_id: ID,
  a_document_data: SimpleCollection<T>["_type"] | undefined,
  a_reference: DocumentReference
): SimpleDocument<T> {
  return {
    ...a_collection,
    $REFERENCE: a_reference,
    data: () => a_document_data,
    id: a_id,
  }
}
