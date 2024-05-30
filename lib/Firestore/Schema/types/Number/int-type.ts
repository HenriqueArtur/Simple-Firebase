import { SimpleNumber } from "./number-type.js"

export interface SimpleInt extends SimpleNumber { }

export class SimpleInt extends SimpleNumber {
  constructor(
    readonly default_value?: number,
    readonly min?: number,
    readonly max?: number
  ) {
    super(default_value, min, max)
  }
}

