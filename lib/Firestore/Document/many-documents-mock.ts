import { query } from "firebase/firestore"

import { type DefaultSchemaMock } from "../Schema/schema-mock.js"
import { type ManySimpleDocuments } from "./many-documents.js"
import { SimpleDocumentDefaultMock } from "./simple-document-mock.js"

export async function ManyDocumentsDefaultMock(): Promise<ManySimpleDocuments<DefaultSchemaMock>> {
  const a_doc_mock = await SimpleDocumentDefaultMock()
  return {
    $METADATA: {
      $QUERY: query(a_doc_mock.$COLLECTION),
      $LIMIT: null,
      $CURSOR_POINT: null,
      $CURSOR: null,
      $COLLECTION: a_doc_mock.$COLLECTION,
      $PATH: a_doc_mock.$PATH,
      $SCHEMA: a_doc_mock.$SCHEMA
    },
    pagination: {
      page: 0,
      pages_discovered: 1,
      documents_discovered: 1
    },
    docs: () => [a_doc_mock]
  }
}
