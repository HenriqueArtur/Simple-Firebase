import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js"
import { collection } from "firebase/firestore"

import { CreateASchema, SCHEMA, type SchemaShape, type SimpleSchema } from "../Schema/schema.js"
import { DEFAULT_SCHEMA_MOCK, type DefaultSchemaMock } from "../Schema/schema-mock.js"
import { FactoryCollection, type SimpleCollectionBase } from "./collection.js"

export async function CollectionMock<T extends SchemaShape>(
  a_schema?: SimpleSchema<T>
) {
  const { FIRESTORE_WEB } = await FirebaseObject()
  const the_firestore = FIRESTORE_WEB
  const the_path = 'test'
  const the_schema = a_schema ?? CreateASchema({
    test: SCHEMA.string()
  })
  return FactoryCollection(the_firestore, the_path, the_schema as SimpleSchema<T>)
}

export async function CollectionBaseDefaultMock():
  Promise<SimpleCollectionBase<DefaultSchemaMock>> {
  const { FIRESTORE_WEB } = await FirebaseObject()
  const the_path = 'test'
  const the_schema = DEFAULT_SCHEMA_MOCK()
  return {
    $COLLECTION: collection(FIRESTORE_WEB, the_path),
    $PATH: the_path,
    $SCHEMA: the_schema
  }
}
