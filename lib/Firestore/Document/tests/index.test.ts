import { CollectionMock } from "@src/Firestore/Collection/collection-mock.js"
import { CreateASchema, SCHEMA } from "@src/Firestore/Schema/index.js"
import { type ID } from "@src/types.js"
import { describe, expect, it } from "vitest"

import { FactorySimpleDocument } from "../index.js"

describe('Document', () => {
  describe('FactorySimpleDocument', () => {
    it('should return a SimpleDocument object with correct properties', async () => {
      const a_schema = CreateASchema({
        test: SCHEMA.string()
      })
      const a_mock_collection = await CollectionMock(a_schema)
      const a_mock_id = 'mock_id' as ID
      const a_mock_data = {
        test: 'test',
      }
      const result = FactorySimpleDocument(a_mock_collection, a_mock_id, a_mock_data)
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      expect(result.$COLLECTION).toBeDefined()
      expect(result.$PATH).toBeDefined()
      expect(result.$PATH).toBe(a_mock_collection.$PATH)
      expect(result.$SCHEMA).toBeDefined()
      expect(result.$SCHEMA).toStrictEqual(a_schema)
      expect(result.id).toBeDefined()
      expect(result.id).toBe(a_mock_id)
      expect(result.data).toBeDefined()
      expect(result.data).toBe(a_mock_data)
    })
  })
})
