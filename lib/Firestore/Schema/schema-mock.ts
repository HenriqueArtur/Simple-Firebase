import { CreateASchema, SCHEMA } from "./schema.js"

const DEFAULT_SCHEMA_SHAPE_MOCK = {
  array: SCHEMA.string().array(),
  boolean: SCHEMA.boolean(),
  date: SCHEMA.date(),
  null: SCHEMA.null(),
  number: SCHEMA.number(),
  text: SCHEMA.string(),
}

export type DefaultSchemaMock = typeof DEFAULT_SCHEMA_SHAPE_MOCK

export function DEFAULT_SCHEMA_MOCK() {
  return CreateASchema(DEFAULT_SCHEMA_SHAPE_MOCK)
}
