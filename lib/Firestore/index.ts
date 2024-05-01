import { type Path } from "@src/types.js"
import { type Firestore } from "firebase/firestore"

import { Collection } from "./Collection/collection.js"
import { type SchemaType } from "./Schema/index.js"

export function BuildFirestore(a_firestore_ref: Firestore) {
  return {
    collection: (
      a_collection_name: Path,
      a_schema: SchemaType
    ) => Collection(a_firestore_ref, a_collection_name, a_schema)
  }
}
