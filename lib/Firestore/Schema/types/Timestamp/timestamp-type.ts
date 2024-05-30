import { type Timestamp } from "firebase/firestore"

import { SimpleTypeDefault } from "../Default/default-type.js"

export interface SimpleTimestamp extends SimpleTypeDefault<Timestamp> { }

export class SimpleTimestamp extends SimpleTypeDefault<Timestamp> {
  constructor(
    readonly default_value?: Timestamp,
  ) {
    super(default_value)
  }
}
