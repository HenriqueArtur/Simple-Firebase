import { type SimpleTypeDefault } from "./default-type.js"

export interface SimpleTypeOptional<T> extends Omit<SimpleTypeDefault<T>, "$TYPE" | "default_value"> {
  readonly $TYPE: T | undefined
  readonly default_value?: T | undefined
}

export class SimpleTypeOptional<T>  {
  readonly $TYPE!: T | undefined

  constructor(
    readonly default_value?: T | undefined
  ) { }
}
