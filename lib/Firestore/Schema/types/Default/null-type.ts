import { NotExist } from "@src/language-functions.js"

import { createSimpleTypeErrorItem, type SimpleTypeErrorItem } from "../../error/simple-type-error.js"
import { type SimpleTypeDefault } from "./default-type.js"

export interface SimpleTypeNull<T> extends Omit<SimpleTypeDefault<T>, "$TYPE" | "default_value"> {
  readonly $TYPE: T | null
  readonly $OLD_INSTANCE?: SimpleTypeDefault<T>
  readonly default_value?: T | null
}

export class SimpleTypeNull<T> {
  readonly $TYPE!: T | null

  constructor(
    readonly $OLD_INSTANCE?: SimpleTypeDefault<T>,
    readonly default_value?: T | null
  ) { }

  validate(a_key: string, a_value: T | null): [SimpleTypeErrorItem, T | null] {
    if (NotExist(a_value)) return [createSimpleTypeErrorItem(a_key, []), this.default_value ?? null]
    return this.$OLD_INSTANCE!.validate(a_key, a_value) as [SimpleTypeErrorItem, T | null]
  }
}
