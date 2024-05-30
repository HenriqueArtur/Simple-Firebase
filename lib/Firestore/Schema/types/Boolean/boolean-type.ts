import { SimpleTypeDefault } from "../Default/default-type.js"

export interface SimpleBoolean extends SimpleTypeDefault<boolean> { }

export class SimpleBoolean extends SimpleTypeDefault<boolean> {
  constructor(
    readonly default_value?: boolean,
  ) {
    super(default_value)
  }
}
