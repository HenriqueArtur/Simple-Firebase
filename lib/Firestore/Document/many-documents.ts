import { type DocumentReference, type Query, type QuerySnapshot } from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/schema.js"
import { FactorySimpleDocument, type SimpleDocument } from "./document.js"

export interface ManySimpleDocuments<T extends SchemaShape> {
  readonly $METADATA: $Metadata
  readonly pagination: $Pagination
  readonly docs: () => Array<SimpleDocument<T>>
}

export interface $Metadata {
  readonly $QUERY: Query
  readonly $LIMIT: number | null
  readonly $CURSOR_POINT: CursorPoint | null
  readonly $CURSOR: DocumentReference | null
}

export type CursorPoint =
  | "START_AT"
  | "START_AFTER"
  | "END_AT"
  | "END_BEFORE"

export interface $Pagination {
  page: number
  pages_discovered: number
  documents_discovered: number
}

export function FactoryManySimpleDocuments<T extends SchemaShape>(
  a_collection: SimpleCollectionBase<T>,
  a_docs_list: QuerySnapshot,
  a_query: Query,
  a_last_many_docs?: ManySimpleDocuments<T>
): ManySimpleDocuments<T> {
  const a_simple_docs = a_docs_list.docs.map(
    (a_doc) => FactorySimpleDocument(
      a_collection,
      a_doc.id,
      a_doc.data() as SimpleCollection<T>["_type"] | undefined,
      a_doc.ref
    )
  )
  return {
    $METADATA: {
      $QUERY: a_query,
      $LIMIT: null,
      $CURSOR_POINT: null,
      $CURSOR: null,
    },
    pagination: {
      page: 0,
      pages_discovered: 1,
      documents_discovered: a_docs_list.size
    },
    docs: () => a_simple_docs
  }
}
