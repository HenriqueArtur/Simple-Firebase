import { type ID, type Path } from "@src/types.js"
import { collection, type CollectionReference, type Firestore } from "firebase/firestore"
import { type z } from "zod"

import { type SimpleDocument } from "../Document/index.js"
import { type SchemaShape, type SimpleSchema } from "../Schema/index.js"
import { Create, type CreateCustomOptions } from "./Operations/create.js"
import { findById } from "./Operations/find-by-id.js"
import { hardDelete } from "./Operations/hard-delete.js"

export interface SimpleCollectionBase<T extends SchemaShape> {
  readonly $COLLECTION: CollectionReference
  readonly $PATH: Path
  readonly $SCHEMA: SimpleSchema<T>
}

export interface SimpleCollection<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly _type: z.infer<SimpleSchema<T>>
  readonly create: (
    a_new_data: SimpleCollection<T>["_type"],
    a_custom_options?: CreateCustomOptions
  ) => Promise<SimpleDocument<T>>
  readonly findById: (an_id: ID) => Promise<SimpleDocument<T>>
  readonly hardDelete: (an_id: ID) => Promise<void>
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

  async create(
    a_new_data: SimpleCollection<T>["_type"],
    a_custom_options?: CreateCustomOptions
  ) {
    return await Create(
      this.$SIMPLE_COLLECTION(),
      a_new_data,
      a_custom_options
    )
  }

  async findById(an_id: ID) {
    return await findById(this.$SIMPLE_COLLECTION(), an_id)
  }

  async hardDelete(an_id: ID) {
    await hardDelete(this.$SIMPLE_COLLECTION(), an_id)
  }

  private $SIMPLE_COLLECTION() {
    return {
      $COLLECTION: this.$COLLECTION,
      $PATH: this.$PATH,
      $SCHEMA: this.$SCHEMA,
    }
  }
}

