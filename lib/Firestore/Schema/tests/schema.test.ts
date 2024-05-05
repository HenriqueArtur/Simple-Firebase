import { describe, expect, it } from "vitest"
import { z } from "zod"

import { CreateASchema, SCHEMA, type SchemaShape, validateSchema } from "../schema.js"

// eslint-disable-next-line max-lines-per-function
describe("Schema", () => {
  describe("SCHEMA Object", () => {
    it("should instantiate SCHEMA Object", () => {
      const SCHEMA_TYPE_QNT = 6
      expect(Object.keys(SCHEMA)).toHaveLength(SCHEMA_TYPE_QNT)
      expect(SCHEMA).toHaveProperty("boolean")
      expect(SCHEMA).toHaveProperty("date")
      expect(SCHEMA).toHaveProperty("map")
      expect(SCHEMA).toHaveProperty("null")
      expect(SCHEMA).toHaveProperty("number")
      expect(SCHEMA).toHaveProperty("string")
    })
  })

  describe("CreateASchema/1", () => {
    it("should create a schema", () => {
      const input: SchemaShape = {
        array: SCHEMA.string().array(),
        boolean: SCHEMA.boolean(),
        date: SCHEMA.date(),
        null: SCHEMA.null(),
        number: SCHEMA.number(),
        string: SCHEMA.string()
      }
      expect(CreateASchema(input)).instanceof(z.ZodObject)
    })
  })

  describe("validateSchema/2", () => {
    it("should validade", () => {
      const a_schema = CreateASchema({
        string: SCHEMA.string()
      })
      const input = {
        string: "string"
      }
      const output = {
        string: "string"
      }
      expect(validateSchema(a_schema, input)).toStrictEqual(output)
    })

    it("should NOT validade", () => {
      const a_schema = CreateASchema({
        string: SCHEMA.string()
      })
      const input = {
        string: 10
      }
      // eslint-disable-next-line max-nested-callbacks
      expect(() => validateSchema(a_schema, input)).toThrow()
    })
  })
})
