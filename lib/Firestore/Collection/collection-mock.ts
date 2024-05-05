import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js"

import { CreateASchema, SCHEMA, type SchemaShape, type SimpleSchema } from "../Schema/schema.js"
import { FactoryCollection } from "./collection.js"

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
