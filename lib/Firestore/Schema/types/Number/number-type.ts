import { SimpleTypeDefault } from "../Default/default-type.js"

export interface SimpleNumber extends SimpleTypeDefault<number> {
  readonly min?: number
  readonly max?: number
}

export class SimpleNumber extends SimpleTypeDefault<number> {
  constructor(
    readonly default_value?: number,
    readonly min?: number,
    readonly max?: number
  ) {
    super(default_value)
  }
}
