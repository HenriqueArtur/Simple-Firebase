import { IsNotEmpty } from "@src/language-functions.js"

import { type SimpleTypeErrorItem } from "./error/simple-type-error.js"
import { type Infer, type SchemaShape, type SimpleSchemaType } from "./schema.js"

export type SchemaValidate<T> = SchemaValidateOK<T> | SchemaValidateERROR

export interface SchemaValidateOK<T> {
  status: "OK",
  data: T
}

export interface SchemaValidateERROR {
  status: "ERROR",
  description: SimpleTypeErrorItem[]
}

export function schemaValidationFaultTolerance<T extends SchemaShape>(
  a_data: Infer<SimpleSchemaType<T>>,
  a_schema: SimpleSchemaType<T>["$SCHEMA"]
): SchemaValidate<Infer<SimpleSchemaType<T>>> {
  const key_errors: SimpleTypeErrorItem[] = []
  const a_data_parsed: Record<string, unknown> = {}
  for (const [key, current_schema] of Object.entries(a_schema)) {
    const [validation, a_value] = current_schema.validate(key, a_data[key])
    if (IsNotEmpty(validation.descriptions))
      key_errors.push(validation)
    a_data_parsed[key] = a_value
  }
  if (IsNotEmpty(key_errors))
    return {
      status: "OK",
      data: a_data_parsed as Infer<SimpleSchemaType<T>>
    }
  return {
    status: "ERROR",
    description: key_errors
  }
}

export function schemaValidation<T extends SchemaShape>(
  a_data: Infer<SimpleSchemaType<T>>,
  a_schema: SimpleSchemaType<T>["$SCHEMA"]
): Infer<SimpleSchemaType<T>> {
  const response = schemaValidationFaultTolerance(a_data, a_schema)
  if (response.status === "ERROR")
    throw new Error()
  return response.data
}
