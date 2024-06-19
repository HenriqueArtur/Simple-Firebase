import { type SimpleTypeErrorItem } from "../../error/simple-type-error.js"
import { SimpleTypeNull } from "./null-type.js"
import { SimpleTypeOptional } from "./optional-type.js"

export abstract class SimpleTypeDefault<T>  {
  readonly $TYPE!: T
  readonly allow_null = false
  readonly is_optional = false

  constructor(
    readonly default_value?: T,
  ) { }

  allowNull() {
    return new SimpleTypeNull<T | null>(this.default_value)
  }

  isOptional() {
    return new SimpleTypeOptional<T | undefined>(this.default_value)
  }

  abstract validate(a_key: string, a_data: T): [SimpleTypeErrorItem, T]
}
