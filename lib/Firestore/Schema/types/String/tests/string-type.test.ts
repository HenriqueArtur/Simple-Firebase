import { describe, expect, it } from "vitest"

import { SimpleString, validateMaxLength, validateMinLength } from "../string-type.js"

describe("SimpleString", () => {
  describe("validate", () => {
    it("should return no errors if the value is within min and max length", () => {
      const simple_string = new SimpleString(undefined, 3, 10)
      const [error_item, value] = simple_string.validate("testKey", "valid")
      expect(error_item.descriptions).toHaveLength(0)
      expect(value).toBe("valid")
    })

    it("should return an error if the value is less than the min length", () => {
      const simple_string = new SimpleString(undefined, 5, 10)
      const [error_item, value] = simple_string.validate("testKey", "four")
      expect(error_item.descriptions).toContain('"four" has length less than "5"')
      expect(value).toBe("four")
    })

    it("should return an error if the value is greater than the max length", () => {
      const simple_string = new SimpleString(undefined, 3, 5)
      const [error_item, value] = simple_string.validate("testKey", "toolong")
      expect(error_item.descriptions).toContain('"toolong" has length greater than "5"')
      expect(value).toBe("toolong")
    })

    it("should return errors if the value is both less than the min length and greater than the max length", () => {
      const simple_string = new SimpleString(undefined, 8, 4)
      const [error_item, value] = simple_string.validate("testKey", "short")
      expect(error_item.descriptions).toContain('"short" has length less than "8"')
      expect(error_item.descriptions).toContain('"short" has length greater than "4"')
      expect(value).toBe("short")
    })

    it("should return no errors if the value is exactly the min length", () => {
      const simple_string = new SimpleString(undefined, 5, 10)
      const [error_item, value] = simple_string.validate("testKey", "exact")
      expect(error_item.descriptions).toHaveLength(0)
      expect(value).toBe("exact")
    })

    it("should return no errors if the value is exactly the max length", () => {
      const simple_string = new SimpleString(undefined, 3, 5)
      const [error_item, value] = simple_string.validate("testKey", "five!")
      expect(error_item.descriptions).toHaveLength(0)
      expect(value).toBe("five!")
    })
  })
})

describe("validateMinLength", () => {
  it("should return true if the value length is less than the minimum length", () => {
    expect(validateMinLength("test", 5)).toBe(true)
    expect(validateMinLength("short", 10)).toBe(true)
  })

  it("should return false if the value length is not less than the minimum length", () => {
    expect(validateMinLength("test", 3)).toBe(false)
    expect(validateMinLength("longer", 6)).toBe(false)
  })

  it("should return false if minimum length is not provided", () => {
    expect(validateMinLength("test")).toBe(false)
  })
})

describe("validateMaxLength", () => {
  it("should return true if the value length is greater than the maximum length", () => {
    expect(validateMaxLength("test", 3)).toBe(true)
    expect(validateMaxLength("longer", 5)).toBe(true)
  })

  it("should return false if the value length is not greater than the maximum length", () => {
    expect(validateMaxLength("test", 5)).toBe(false)
    expect(validateMaxLength("short", 10)).toBe(false)
  })

  it("should return false if maximum length is not provided", () => {
    expect(validateMaxLength("test")).toBe(false)
  })
})
