import { type Path } from "@src/types.js"
import { collection, type CollectionReference, type Firestore } from "firebase/firestore"
import { type z } from "zod"

import { type SchemaShape, type SimpleSchema } from "../Schema/index.js"

export interface SimpleCollection<T extends SchemaShape> {
  readonly _type: z.infer<SimpleSchema<T>>
  readonly $COLLECTION: CollectionReference
  readonly $PATH: Path
  readonly $SCHEMA: SimpleSchema<T>
}

export function FactoryCollection<T extends SchemaShape>(
  a_firestore_ref: Firestore,
  a_path: Path,
  a_schema: SimpleSchema<T>
): SimpleCollection<T> {
  return new ConcreteSimpleCollection(
    a_firestore_ref,
    a_path,
    a_schema
  )
}

class ConcreteSimpleCollection<T extends SchemaShape> {
  readonly _type!: z.infer<SimpleSchema<T>>
  readonly $COLLECTION: CollectionReference
  readonly $PATH: Path
  readonly $SCHEMA: SimpleSchema<T>

  constructor(
    a_firestore_ref: Firestore,
    a_path: Path,
    a_schema: SimpleSchema<T>
  ) {
    this.$COLLECTION = collection(a_firestore_ref, a_path)
    this.$PATH = a_path
    this.$SCHEMA = a_schema
  }
}
