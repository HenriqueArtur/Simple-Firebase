import { FactorySimpleSchema, SCHEMA } from "@src/Firestore/Schema/schema.js"
import { BuildServicesTest } from "@src/tests/helpers/build-services.js"
import { describe, expect, it } from "vitest"

import { FactoryCollection } from "../collection.js"

describe('Collection', async () => {
  const { FIRESTORE_WEB } = await BuildServicesTest()

  describe('FactoryCollection', () => {
    it('should return a SimpleCollection object with correct properties', () => {
      const a_firestore = FIRESTORE_WEB
      const a_path = 'test'
      const a_schema = FactorySimpleSchema({
        test: SCHEMA.string()
      })
      const result = FactoryCollection(a_firestore, a_path, a_schema)
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      expect(result.$COLLECTION).toBeDefined()
      expect(result.$PATH).toBeDefined()
      expect(result.$PATH).toBe(a_path)
      expect(result.$SCHEMA).toBeDefined()
      expect(result.$SCHEMA).toBe(a_schema)
    })
  })
})
