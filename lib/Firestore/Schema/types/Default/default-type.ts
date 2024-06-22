import { type SimpleTypeErrorItem } from "../../error/simple-type-error.js"
import { SimpleTypeNull } from "./null-type.js"
import { SimpleTypeOptional } from "./optional-type.js"

export abstract class SimpleTypeDefault<T> {
  readonly $TYPE!: T

  constructor(
    readonly default_value?: T,
  ) { }

  allowNull() {
    return new SimpleTypeNull<T>(this)
  }

  isOptional() {
    return new SimpleTypeOptional<T>(this)
  }

  abstract validate(a_key: string, a_data: unknown): [SimpleTypeErrorItem, unknown]
}
