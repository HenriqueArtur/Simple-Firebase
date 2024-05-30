import { type SimpleTypeDefault } from "./default-type.js"

export interface SimpleTypeNull<T> extends Omit<SimpleTypeDefault<T>, "$TYPE" | "default_value"> {
  readonly $TYPE: T | null
  readonly default_value?: T | null
}

export class SimpleTypeNull<T>  {
  readonly $TYPE!: T | null

  constructor(
    readonly default_value?: T | null
  ) { }
}
