import { Exist } from "@src/language-functions.js"

import { createSimpleTypeErrorItem, type SimpleTypeErrorItem, type ValidationTuple } from "../../error/simple-type-error.js"
import { SimpleTypeDefault } from "../Default/default-type.js"

export interface SimpleString extends SimpleTypeDefault<string> {
  readonly min_length?: number
  readonly max_length?: number
}

export class SimpleString extends SimpleTypeDefault<string> {
  constructor(
    readonly default_value?: string,
    readonly min_length?: number,
    readonly max_length?: number
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
        validateMinLength(a_value, this.min_length),
        `"${a_value}" has length less than "${this.min_length}"`
      ],
      [
        validateMaxLength(a_value, this.max_length),
        `"${a_value}" has length greater than "${this.max_length}"`
      ],
    ]
  }
}

export function validateMinLength(a_value: string, a_min_length?: number): boolean {
  return Exist(a_min_length) && a_value.length < a_min_length!
}

export function validateMaxLength(a_value: string, a_max_length?: number): boolean {
  return Exist(a_max_length) && a_value.length > a_max_length!
}
