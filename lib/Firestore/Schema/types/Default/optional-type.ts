import { NotExist } from "@src/language-functions.js"

import { createSimpleTypeErrorItem, type SimpleTypeErrorItem } from "../../error/simple-type-error.js"
import { type SimpleTypeDefault } from "./default-type.js"

export interface SimpleTypeOptional<T> extends Omit<SimpleTypeDefault<T>, "$TYPE" | "default_value"> {
  readonly $TYPE: T | undefined
  readonly $OLD_INSTANCE: SimpleTypeDefault<T>
  readonly default_value?: T | undefined
}

export class SimpleTypeOptional<T> {
  readonly $TYPE!: T | undefined

  constructor(
    readonly $OLD_INSTANCE: SimpleTypeDefault<T>
  ) { }

  validate(a_key: string, a_value?: T): [SimpleTypeErrorItem, T | undefined] {
    if (NotExist(a_value)) return [createSimpleTypeErrorItem(a_key, []), this.default_value ?? undefined]
    return this.$OLD_INSTANCE.validate(a_key, a_value) as [SimpleTypeErrorItem, T | undefined]
  }
}
