import { schemaValidation } from "./schema-validation.js"
import { SimpleBoolean } from "./types/Boolean/boolean-type.js"
import { type SimpleTypeDefault } from "./types/Default/default-type.js"
import { SimpleTypeNull } from "./types/Default/null-type.js"
import { SimpleFloat } from "./types/Number/float-type.js"
import { SimpleInt } from "./types/Number/int-type.js"
import { SimpleNumber } from "./types/Number/number-type.js"
import { SimpleString } from "./types/String/string-type.js"
import { SimpleTimestamp } from "./types/Timestamp/timestamp-type.js"

export const SCHEMA = {
  boolean: () => new SimpleBoolean(),
  date: () => new SimpleTimestamp(),
  null: () => new SimpleTypeNull(),
  number: () => new SimpleNumber(),
  int: () => new SimpleInt(),
  float: () => new SimpleFloat(),
  string: () => new SimpleString(),
}

export interface SimpleSchema<T> extends SimpleSchemaType<T>, SimpleSchemaFunctions<T> { }

export interface SimpleSchemaType<T> {
  readonly $SCHEMA: T
}

export interface SimpleSchemaFunctions<T> {
  readonly validate: (data: Infer<SimpleSchemaType<T>>) => Infer<SimpleSchemaType<T>>
}

export type Infer<T extends SimpleSchemaType<unknown>> = {
  [K in keyof T["$SCHEMA"]]: T["$SCHEMA"][K] extends SimpleTypeDefault<infer I>
  ? I
  : never
}

export type SchemaShape = Record<string, SimpleTypeDefault<unknown>>

export function FactorySimpleSchema<T extends SchemaShape>(
  a_schema: T
): SimpleSchema<T> {
  return {
    $SCHEMA: a_schema,
    validate: (a_data: Infer<SimpleSchemaType<T>>): Infer<SimpleSchemaType<T>> =>
      schemaValidation(a_data, a_schema)
  }
}

