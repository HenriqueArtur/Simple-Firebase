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

export interface SimpleSchema<T> {
  readonly $SCHEMA: T
}

export type Infer<T extends SimpleSchema<unknown>> = {
  [K in keyof T["$SCHEMA"]]: T["$SCHEMA"][K] extends SimpleTypeDefault<infer I>
  ? I
  : never
}

export function FactorySimpleSchema<T extends Record<string, SimpleTypeDefault<unknown>>>(
  a_schema: T
): SimpleSchema<T> {
  return {
    $SCHEMA: a_schema
  }
}
