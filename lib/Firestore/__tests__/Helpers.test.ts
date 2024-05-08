/* eslint-disable max-lines-per-function */
import {
  flattenObject,
  formatAKey,
  formatDirection
} from "@src/Firestore/Helpers.js"
import { describe, expect, it } from "vitest"

describe("Firestore Helpers", () => {
  describe("flattenObject/1", () => {
    it("should flatter object", () => {
      const input = {
        key1: "value1",
        key2: {
          key3: "value3",
          key4: {
            key5: "value5"
          }
        }
      }
      const output = {
        key1: "value1",
        "key2.key3": "value3",
        "key2.key4.key5": "value5"
      }
      expect(flattenObject(input)).toStrictEqual(output)
    })
  })

  describe("formatAKey/2", () => {
    it('should "lastKey" was empty', () => {
      expect(formatAKey("currentKey", "")).toBe("currentKey")
    })

    it('should "lastKey" NOT was empty', () => {
      expect(formatAKey("currentKey", "nest")).toBe("nest.currentKey")
    })
  })

  describe("formatDirection/2", () => {
    it('should return "asc"', () => {
      expect(formatDirection("ASC")).toBe("asc")
    })

    it('should return "desc"', () => {
      expect(formatDirection("DESC")).toBe("desc")
    })
  })
})
