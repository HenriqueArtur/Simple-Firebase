import { type ID } from "@src/types.js"

import { type SimpleCollection } from "../Collection/collection.js"
import { type SchemaShape } from "../Schema/index.js"

export interface SimpleDocument<T extends SchemaShape> extends SimpleCollection<T> {
  readonly id: ID;
  readonly data: SimpleCollection<T>["_type"];
}

export function FactorySimpleDocument<T extends SchemaShape>(
  a_collection: SimpleCollection<T>,
  a_id: ID,
  a_document_data: SimpleCollection<T>["_type"]
): SimpleDocument<T> {
  return {
    ...a_collection,
    data: a_document_data,
    id: a_id,
  }
}
