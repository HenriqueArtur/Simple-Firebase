import { type DocumentReference, type Query } from "firebase/firestore"

import { type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/schema.js"
import { type SimpleDocument } from "./document.js"

export type ManySimpleDocuments<T extends SchemaShape> =
  | ManySimpleDocumentsWithCursor<T>
  | ManySimpleDocumentsWithoutCursor<T>

export interface ManySimpleDocumentsWithCursor<T extends SchemaShape> {
  readonly $METADATA: $MetadataWithCursor<T>
  readonly pagination: $Pagination
  readonly docs: () => Array<SimpleDocument<T>>
}

export interface ManySimpleDocumentsWithoutCursor<T extends SchemaShape> {
  readonly $METADATA: $MetadataWithoutCursor<T>
  readonly pagination: $Pagination
  readonly docs: () => Array<SimpleDocument<T>>
}

export type $Metadata<T extends SchemaShape> =
  | $MetadataWithCursor<T>
  | $MetadataWithoutCursor<T>

export interface $MetadataWithCursor<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly $QUERY: Query
  readonly $LIMIT: number
  readonly $CURSOR_POINT: CursorPoint
  readonly $CURSOR: DocumentReference
}

export interface $MetadataWithoutCursor<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly $QUERY: Query
  readonly $LIMIT: null
  readonly $CURSOR_POINT: null
  readonly $CURSOR: null
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

export type MetadataInfo =
  | MetadataInfoWithCursor
  | MetadataInfoWithoutCursor

export interface MetadataInfoWithCursor {
  readonly $QUERY: Query
  readonly $LIMIT: number
  readonly $CURSOR_POINT: CursorPoint
}

export interface MetadataInfoWithoutCursor {
  readonly $QUERY: Query
  readonly $LIMIT: null
  readonly $CURSOR_POINT: null
}

export type DocumentBuildRule =
  | "DEFAULT"
  | "NEXT"
  | "PREVIOUS"

