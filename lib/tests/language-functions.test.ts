import {
  ArrayIsEmpty,
  Exist,
  includesSome,
  IsEmpty,
  IsNotEmpty,
  ObjectIsEmpty,
  SizeMoreThanOne,
  StringIsEmpty
} from "@src/language-functions.js"
import { describe, expect, it } from "vitest"

describe("includesSome", () => {
  it("should return true if any value in values_to_check is present in an_array", () => {
    expect(includesSome([1, 2, 3], [2])).toBe(true)
    expect(includesSome(["a", "b", "c"], ["c", "d"])).toBe(true)
  })

  it("should return false if none of the values in values_to_check is present in an_array", () => {
    expect(includesSome([1, 2, 3], [4])).toBe(false)
    expect(includesSome(["a", "b", "c"], ["d", "e"])).toBe(false)
  })
})

describe("IsNotEmpty", () => {
  it("should return true if the structure is not empty", () => {
    expect(IsNotEmpty([1, 2, 3])).toBe(true)
    expect(IsNotEmpty("abc")).toBe(true)
    expect(IsNotEmpty({ key: "value" })).toBe(true)
  })

  it("should return false if the structure is empty", () => {
    expect(IsNotEmpty([])).toBe(false)
    expect(IsNotEmpty("")).toBe(false)
    expect(IsNotEmpty({})).toBe(false)
    expect(IsNotEmpty(null)).toBe(false)
    expect(IsNotEmpty(undefined)).toBe(false)
  })
})

describe("IsEmpty", () => {
  it("should return true for empty structures", () => {
    expect(IsEmpty(null)).toBe(true)
    expect(IsEmpty(undefined)).toBe(true)
    expect(IsEmpty([])).toBe(true)
    expect(IsEmpty({})).toBe(true)
    expect(IsEmpty("")).toBe(true)
  })

  it("should return false for non-empty structures", () => {
    expect(IsEmpty([1, 2, 3])).toBe(false)
    expect(IsEmpty({ key: "value" })).toBe(false)
    expect(IsEmpty("non-empty string")).toBe(false)
  })
})

describe("ObjectIsEmpty", () => {
  it("should return true for an empty object", () => {
    expect(ObjectIsEmpty({})).toBe(true)
  })

  it("should return false for a non-empty object", () => {
    expect(ObjectIsEmpty({ key: "value" })).toBe(false)
  })
})

describe("StringIsEmpty", () => {
  it("should return true for an empty string", () => {
    expect(StringIsEmpty("")).toBe(true)
  })

  it("should return false for a non-empty string", () => {
    expect(StringIsEmpty("non-empty string")).toBe(false)
  })
})

describe("ArrayIsEmpty", () => {
  it("should return true for an empty array", () => {
    expect(ArrayIsEmpty([])).toBe(true)
  })

  it("should return false for a non-empty array", () => {
    expect(ArrayIsEmpty([1, 2, 3])).toBe(false)
  })
})

describe("Exist", () => {
  it("should return true for null or undefined", () => {
    expect(Exist(null)).toBe(true)
    expect(Exist(undefined)).toBe(true)
  })

  it("should return false for non-null and defined values", () => {
    expect(Exist("")).toBe(false)
    expect(Exist([])).toBe(false)
    expect(Exist({})).toBe(false)
  })
})

describe("SizeMoreThanOne", () => {
  it("should return true for an array or string with more than one element", () => {
    expect(SizeMoreThanOne([1, 2, 3])).toBe(true)
    expect(SizeMoreThanOne("abc")).toBe(true)
  })

  it("should return false for an array or string with one or fewer elements", () => {
    expect(SizeMoreThanOne([])).toBe(false)
    expect(SizeMoreThanOne("a")).toBe(false)
  })
})
