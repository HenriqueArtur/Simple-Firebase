import { Exist } from "@src/language-functions.js"
import { type DocumentReference } from "firebase/firestore"

import { type SimpleCollectionBase } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/schema.js"
import { type SimpleDocument } from "./document.js"
import { defineMetadata, definePaginationByRule, validateManySimpleDocuments } from "./many-documents-handlers.js"
import {
  type $MetadataWithCursor,
  type $MetadataWithoutCursor,
  type DocumentBuildRule,
  type ManySimpleDocuments,
  type ManySimpleDocumentsWithCursor,
  type ManySimpleDocumentsWithoutCursor,
  type MetadataInfo
} from "./many-documents-types.js"

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


