import { FactorySimpleDocument } from "@src/Firestore/Document/document.js"
import {
  FactoryManySimpleDocuments
} from "@src/Firestore/Document/many-documents.js"
import { buildMetaData } from "@src/Firestore/Document/many-documents-handlers.js"
import { formatQuery } from "@src/Firestore/Query/query.js"
import { type SimpleQuery } from "@src/Firestore/Query/query-types.js"
import { type SchemaShape } from "@src/Firestore/Schema/schema.js"
import { getDocs } from "firebase/firestore"

import { type SimpleCollection, type SimpleCollectionBase } from "../collection.js"

export async function findMany<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  a_query: SimpleQuery<SimpleCollection<T>["_type"]>
) {
  const a_query_firestore_web = formatQuery(
    a_simple_collection.$COLLECTION,
    a_query
  )
  const a_docs_list = await getDocs(a_query_firestore_web)
  const a_simple_docs = a_docs_list.docs.map(
    (a_doc) => FactorySimpleDocument(
      a_simple_collection,
      a_doc.id,
      a_doc.data() as SimpleCollection<T>["_type"] | undefined,
      a_doc.ref
    )
  )
  const a_metadata_info = buildMetaData(
    a_query_firestore_web,
    a_query.limit
  )
  return FactoryManySimpleDocuments(
    a_simple_collection,
    a_simple_docs,
    a_metadata_info
  )
}


