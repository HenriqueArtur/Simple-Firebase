import { Exist } from "@src/language-functions.js"

import { createSimpleTypeErrorItem, type SimpleTypeErrorItem, type ValidationTuple } from "../../error/simple-type-error.js"
import { SimpleTypeDefault } from "../Default/default-type.js"

export interface SimpleString extends SimpleTypeDefault<string> {
  readonly min_lenght?: number
  readonly max_lenght?: number
}

export class SimpleString extends SimpleTypeDefault<string> {
  constructor(
    readonly default_value?: string,
    readonly min_lenght?: number,
    readonly max_lenght?: number
  ) {
    super(default_value)
  }

  validate(a_key: string, a_value: string): [SimpleTypeErrorItem, string] {
    return [createSimpleTypeErrorItem(
      a_key,
      this.validationChain(a_value)
    ),
      a_value
    ]
  }

  private validationChain(a_value: string): ValidationTuple[] {
    return [
      [
        Exist(this.min_lenght) && a_value.length < this.min_lenght!,
        `"${a_value}" has length less than "${this.min_lenght}"`
      ],
      [
        Exist(this.max_lenght) && a_value.length > this.max_lenght!,
        `"${a_value}" has length greater than "${this.max_lenght}"`
      ],
    ]
  }
}

