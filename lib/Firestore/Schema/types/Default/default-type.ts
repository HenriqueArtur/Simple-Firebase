import { SimpleTypeNull } from "./null-type.js"
import { SimpleTypeOptional } from "./optional-type.js"

export interface SimpleTypeDefault<T> {
  readonly $TYPE: T
  readonly default_value?: T
  allowNull: () => SimpleTypeNull<T | null>
  isOptional: () => SimpleTypeOptional<T | undefined>
}

export class SimpleTypeDefault<T>  {
  readonly $TYPE!: T

  constructor(
    readonly default_value?: T,
  ) { }

  allowNull = () => new SimpleTypeNull<T | null>(this.default_value)
  isOptional = () => new SimpleTypeOptional<T | undefined>(this.default_value)
}
