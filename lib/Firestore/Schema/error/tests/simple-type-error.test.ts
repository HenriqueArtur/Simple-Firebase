import { describe, expect, it } from "vitest"

import { runChainOfValidations, type ValidationTuple } from "../simple-type-error.js"

describe("runChainOfValidations", () => {
  it("should return an empty errors list if no validations are provided", () => {
    const result = runChainOfValidations([])
    expect(result).toEqual([])
  })

  it("should return an empty errors list if all expressions are false", () => {
    const validations: ValidationTuple[] = [
      [false, "Error 1"],
      [false, "Error 2"],
      [false, "Error 3"]
    ]
    const result = runChainOfValidations(validations)
    expect(result).toEqual([])
  })

  it("should return a list of errors for true expressions", () => {
    const validations: ValidationTuple[] = [
      [true, "Error 1"],
      [false, "Error 2"],
      [true, "Error 3"]
    ]
    const result = runChainOfValidations(validations)
    expect(result).toEqual(["Error 1", "Error 3"])
  })

  it("should handle an initial non-empty errors list", () => {
    const validations: ValidationTuple[] = [
      [true, "Error 1"],
      [false, "Error 2"]
    ]
    const result = runChainOfValidations(validations, ["Initial Error"])
    expect(result).toEqual(["Initial Error", "Error 1"])
  })

  it("should return the errors list unchanged if a validation has missing expression and error", () => {
    const validations: ValidationTuple[] = [
      [false, "Error 1"],
      [false, ""]
    ]
    const result = runChainOfValidations(validations)
    expect(result).toEqual([])
  })
})
