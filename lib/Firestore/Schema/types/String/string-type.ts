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
}
