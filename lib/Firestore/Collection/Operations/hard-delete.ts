import { type SchemaShape } from "@src/Firestore/Schema/schema.js"
import { type ID } from "@src/types.js"
import { deleteDoc, doc } from "firebase/firestore"

import { type SimpleCollectionBase } from "../collection.js"


export async function hardDelete<T extends SchemaShape>(
  a_simple_collection: SimpleCollectionBase<T>,
  an_id: ID
) {
  await deleteDoc(doc(a_simple_collection.$COLLECTION, an_id))
}

