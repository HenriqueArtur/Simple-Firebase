import { type SimpleTypeDefault } from "./Default/default-type.js"
import { type SimpleFloat } from "./Number/float-type.js"
import { type SimpleInt } from "./Number/int-type.js"
import { type SimpleNumber } from "./Number/number-type.js"
import { type SimpleString } from "./String/string-type.js"

export type SimpleType =
  | SimpleString
  | SimpleFloat
  | SimpleInt
  | SimpleNumber

export type InferType<T extends SimpleTypeDefault<unknown>> = T["$TYPE"]
