import { type Path } from "@src/types.js"
import { collection, type CollectionReference, type Firestore } from "firebase/firestore"

import { type SchemaType } from "../Schema/index.js"

export interface SimpleCollection {
  readonly $COLLECTION: CollectionReference
  readonly $PATH: Path
  readonly $SCHEMA: SchemaType
}

export function Collection(
  a_firestore_ref: Firestore,
  a_path: Path,
  a_schema: SchemaType
): SimpleCollection {
  return {
    $COLLECTION: collection(a_firestore_ref, a_path),
    $PATH: a_path,
    $SCHEMA: a_schema
  }
}
