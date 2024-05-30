import { SimpleNumber } from "./number-type.js"

export interface SimpleFloat extends SimpleNumber {
  readonly max_decimals?: number
}

export class SimpleFloat extends SimpleNumber {
  constructor(
    readonly default_value?: number,
    readonly min?: number,
    readonly max?: number,
    readonly max_decimals?: number
  ) {
    super(default_value, min, max)
  }
}

