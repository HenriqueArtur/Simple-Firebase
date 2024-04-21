import { addDoc, type CollectionReference, getDoc } from "firebase/firestore/lite"

export async function create(
  a_collection: CollectionReference,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a_new_data: any
) {
  const a_doc_ref = await addDoc(a_collection, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return a_doc_snap
}


