import { type CollectionReference, doc, getDoc, setDoc } from "firebase/firestore"

export async function createATestDefaultObject(
  a_collection: CollectionReference,
  a_new_data: object,
  a_custom_id = "custom_id"
) {
  const a_doc_ref = doc(a_collection, a_custom_id)
  await setDoc(a_doc_ref, a_new_data)
  const a_doc_snap = await getDoc(a_doc_ref)
  return {
    data: a_doc_snap.data(),
    id: a_doc_snap.id,
    reference: a_doc_snap.ref
  }
}
