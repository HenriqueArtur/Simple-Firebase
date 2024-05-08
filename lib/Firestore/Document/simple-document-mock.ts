import { doc, setDoc } from "firebase/firestore"

import { CollectionBaseDefaultMock } from "../Collection/collection-mock.js"
import { FactorySimpleDocument } from "./index.js"

const AN_YEAR = 2000
const A_MONTH_N_DAY = 1
const A_DATA = {
  array: ["test"],
  boolean: false,
  date: new Date(Date.UTC(AN_YEAR, A_MONTH_N_DAY, A_MONTH_N_DAY)),
  null: null,
  number: 1,
  text: "text",
}


export async function SimpleDocumentDefaultMock() {
  const AN_ID = "test"
  const a_collection = await CollectionBaseDefaultMock()
  const a_doc_ref = doc(a_collection.$COLLECTION, AN_ID)
  await setDoc(a_doc_ref, A_DATA)
  return FactorySimpleDocument(
    a_collection,
    AN_ID,
    A_DATA,
    a_doc_ref
  )
}
