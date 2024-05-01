import { type ID } from "@src/types.js"

import { type SimpleCollection } from "../Collection/collection.js"

export interface SimpleDocument extends SimpleCollection {
  readonly id: ID;
  readonly data: object;
}

export function FactorySimpleDocument(
  a_collection: SimpleCollection,
  a_id: ID,
  a_document_data: object
): SimpleDocument {
  return {
    ...a_collection,
    data: a_document_data,
    id: a_id,
  }
}
