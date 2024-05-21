import { Exist, NotExist } from "@src/language-functions.js"
import { type DocumentReference, type Query } from "firebase/firestore"

import { type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/schema.js"
import { type SimpleDocument } from "./document.js"
import {
  type $Metadata,
  type $MetadataWithCursor,
  type $MetadataWithoutCursor,
  type $Pagination,
  type CursorPoint,
  type ManySimpleDocuments,
  type ManySimpleDocumentsWithCursor,
  type ManySimpleDocumentsWithoutCursor
} from "./many-documents-types.js"

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

export function FactoryManySimpleDocuments<T extends SchemaShape>(
  a_collection: SimpleCollectionBase<T>,
  a_docs_list: Array<SimpleDocument<T>>,
  a_metadata: MetadataInfo,
  a_cursor?: DocumentReference,
  a_previous_many_docs?: ManySimpleDocuments<T>,
  a_rule: DocumentBuildRule = "DEFAULT",
): ManySimpleDocuments<T> {
  validateManySimpleDocuments(a_rule, a_previous_many_docs)
  if (Exist(a_cursor)) {
    const a_final_documents: ManySimpleDocumentsWithCursor<T> = {
      $METADATA: defineMetadata(
        a_collection,
        a_metadata,
        a_cursor
      ) as $MetadataWithCursor<T>,
      pagination: definePaginationByRule(
        a_rule,
        a_docs_list.length,
        a_previous_many_docs?.pagination
      ),
      docs: () => a_docs_list
    }
    return a_final_documents
  }
  const a_final_documents: ManySimpleDocumentsWithoutCursor<T> = {
    $METADATA: defineMetadata(
      a_collection,
      a_metadata,
      a_cursor
    ) as $MetadataWithoutCursor<T>,
    pagination: definePaginationByRule(
      a_rule,
      a_docs_list.length,
      a_previous_many_docs?.pagination
    ),
    docs: () => a_docs_list
  }
  return a_final_documents
}

export function validateManySimpleDocuments<T extends SchemaShape>(
  a_rule: DocumentBuildRule,
  a_previous_many_docs?: ManySimpleDocuments<T>,
): void {
  const A_FIRST_PAGE = 0
  const IS_FIRST_FACTORY_AND_TRY_PREV =
    NotExist(a_previous_many_docs)
    && a_rule === "PREVIOUS"
  const IS_FIRST_FILLED_AND_TRY_PREV =
    a_previous_many_docs?.pagination.page === A_FIRST_PAGE
    && a_rule === "PREVIOUS"
  if (IS_FIRST_FACTORY_AND_TRY_PREV || IS_FIRST_FILLED_AND_TRY_PREV)
    throw new Error("Not get previous page if first page")
}

export function defineMetadata<T extends SchemaShape>(
  a_collection: SimpleCollectionBase<T>,
  a_metadata: MetadataInfo,
  a_cursor?: DocumentReference
): $Metadata<T> {
  if (a_metadata.$LIMIT === null) {
    const a_final_metadata: $MetadataWithoutCursor<T> = {
      ...a_collection,
      ...a_metadata,
      $CURSOR: null,
    }
    return a_final_metadata
  }
  const a_final_metadata: $MetadataWithCursor<T> = {
    ...a_collection,
    ...a_metadata,
    $CURSOR: a_cursor!,
  }
  return a_final_metadata
}

export function definePaginationByRule(
  a_rule: DocumentBuildRule,
  a_docs_list_size: number,
  a_previous_pagination?: $Pagination
): $Pagination {
  return {
    page: definePageByRule(
      a_rule,
      a_previous_pagination?.page
    ),
    pages_discovered: definePagesDiscovered(
      a_rule,
      a_docs_list_size,
      a_previous_pagination
    ),
    documents_discovered: defineDocumentsDiscovered(
      a_rule,
      a_docs_list_size,
      a_previous_pagination
    )
  }
}

const A_FIRST_PAGE = 0
export function definePageByRule(
  a_rule: DocumentBuildRule,
  a_previous_page: number = A_FIRST_PAGE
): number {
  const ONE = 1
  const NEGATIVE_PAGE = -1
  if (a_rule === "DEFAULT") return A_FIRST_PAGE
  if (a_rule === "NEXT") return a_previous_page + ONE
  const a_previous_current_page = a_previous_page - ONE
  return a_previous_current_page === NEGATIVE_PAGE
    ? A_FIRST_PAGE
    : a_previous_current_page
}

export function definePagesDiscovered(
  a_rule: DocumentBuildRule,
  a_docs_list_size: number,
  a_previous_pagination?: $Pagination
): number {
  const ONE = 1
  const EMPTY_LIST = 0
  if (a_rule === "PREVIOUS" && Exist(a_previous_pagination))
    return a_previous_pagination!.pages_discovered
  if (a_rule === "NEXT" && a_docs_list_size === EMPTY_LIST)
    return a_previous_pagination!.pages_discovered
  if (a_rule === "NEXT")
    return a_previous_pagination!.pages_discovered + ONE
  return ONE
}

export function defineDocumentsDiscovered(
  a_rule: DocumentBuildRule,
  a_docs_list_size: number,
  a_previous_pagination?: $Pagination
): number {
  if (a_rule === "PREVIOUS" && Exist(a_previous_pagination))
    return a_previous_pagination!.documents_discovered
  if (a_rule === "NEXT")
    return a_previous_pagination!.documents_discovered + a_docs_list_size
  return a_docs_list_size
}
