import { BuildServicesTest } from "@src/tests/helpers/build-services.js"
import { type CollectionReference, type DocumentReference } from "firebase/firestore"

export async function FactoryFirestoreDocumentReferenceMock(): Promise<DocumentReference> {
  const { FIRESTORE_WEB } = await BuildServicesTest()
  const a_collection: CollectionReference = {
    converter: null,
    firestore: FIRESTORE_WEB,
    id: "id",
    parent: null,
    path: "test",
    type: "collection",
    withConverter: () => {
      throw new Error("Function not implemented.")
    },
  }
  const a_document: DocumentReference = {
    converter: null,
    firestore: FIRESTORE_WEB,
    id: "id",
    parent: a_collection,
    path: "test",
    type: "document",
    withConverter: () => {
      throw new Error("Function not implemented.")
    }
  }
  return a_document
}
