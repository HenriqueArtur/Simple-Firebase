import { FactoryManySimpleDocuments } from "@src/Firestore/Document/many-documents.js"
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
  return FactoryManySimpleDocuments(
    a_simple_collection,
    a_docs_list,
    a_query_firestore_web
  )
}

