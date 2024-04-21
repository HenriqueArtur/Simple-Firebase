import { z } from "zod"

export type SchemaType = z.ZodRawShape

export const SCHEMA = {
  array: <T extends z.ZodTypeAny>(a_type: T) => z.array(a_type),
  boolean: () => z.boolean(),
  date: () => z.date(),
  map: <T extends z.ZodRawShape>(a_map_schema: T) => z.object(a_map_schema),
  null: () => z.null(),
  number: () => z.number(),
  string: () => z.string(),
}

export function CreateASchema<T extends z.ZodRawShape>(a_schema: T) {
  return z.object(a_schema)
}

export function validateSchema<T extends z.ZodTypeAny>(a_schema: T, a_data: unknown) {
  return a_schema.parse(a_data) as z.infer<T>
}
