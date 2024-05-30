import { type Deep, type ID, type Path } from "@src/types.js"
import { collection, type CollectionReference, type Firestore } from "firebase/firestore"

import { type SimpleDocument } from "../Document/document.js"
import { type ManySimpleDocuments } from "../Document/many-documents-types.js"
import { type SimpleQuery } from "../Query/query-types.js"
import { type Infer, type SchemaShape, type SimpleSchema } from "../Schema/schema.js"
import { Create, type CreateCustomOptions } from "./Operations/create.js"
import { findById } from "./Operations/find-by-id.js"
import { findMany } from "./Operations/find-many.js"
import { hardDelete } from "./Operations/hard-delete.js"
import { update } from "./Operations/update.js"

export interface SimpleCollectionBase<T extends SchemaShape> {
  readonly $COLLECTION: CollectionReference
  readonly $PATH: Path
  readonly $SCHEMA: SimpleSchema<T>
}

export interface SimpleCollection<T extends SchemaShape> extends SimpleCollectionBase<T> {
  readonly $TYPE: Infer<SimpleSchema<T>>
  readonly create: (
    a_new_data: SimpleCollection<T>["$TYPE"],
    a_custom_options?: CreateCustomOptions
  ) => Promise<SimpleDocument<T>>
  readonly findById: (
    an_id: ID
  ) => Promise<SimpleDocument<T>>
  readonly findMany: (
    a_query: SimpleQuery<SimpleCollection<T>["$TYPE"]>
  ) => Promise<ManySimpleDocuments<T>>
  readonly hardDelete: (
    an_id: ID
  ) => Promise<void>
  readonly update: (
    a_document: ID | SimpleDocument<T>,
    a_new_data: Deep<SimpleCollection<T>["$TYPE"]>
  ) => Promise<SimpleDocument<T>>
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
  readonly $TYPE!: Infer<SimpleSchema<T>>
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
    a_new_data: SimpleCollection<T>["$TYPE"],
    a_custom_options?: CreateCustomOptions
  ) {
    return await Create(
      this.$SIMPLE_COLLECTION(),
      a_new_data,
      a_custom_options
    )
  }

  async findById(an_id: ID) {
    return await findById(
      this.$SIMPLE_COLLECTION(),
      an_id
    )
  }

  async findMany(a_query: SimpleQuery<SimpleCollection<T>["$TYPE"]>) {
    return await findMany(
      this.$SIMPLE_COLLECTION(),
      a_query
    )
  }

  async hardDelete(an_id: ID) {
    await hardDelete(
      this.$SIMPLE_COLLECTION(),
      an_id
    )
  }

  async update(
    a_document: ID | SimpleDocument<T>,
    a_new_data: Deep<SimpleCollection<T>["$TYPE"]>
  ) {
    return await update(
      this.$SIMPLE_COLLECTION(),
      a_document,
      a_new_data
    )
  }

  private $SIMPLE_COLLECTION() {
    return {
      $COLLECTION: this.$COLLECTION,
      $PATH: this.$PATH,
      $SCHEMA: this.$SCHEMA,
    }
  }
}

