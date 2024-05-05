import { CreateASchema, SCHEMA } from "./schema.js"

export function DEFAULT_SCHEMA_MOCK() {
  return CreateASchema({
    array: SCHEMA.string().array(),
    boolean: SCHEMA.boolean(),
    date: SCHEMA.date(),
    null: SCHEMA.null(),
    number: SCHEMA.number(),
    text: SCHEMA.string(),
  })
}
