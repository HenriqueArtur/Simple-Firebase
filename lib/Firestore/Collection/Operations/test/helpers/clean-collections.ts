import {
  collection,
  type CollectionReference,
  deleteDoc,
  type Firestore,
  getDocs,
  query
} from "firebase/firestore"

export async function cleanCollections(
  a_firestore_ref: Firestore,
  a_collection_list: string[]
): Promise<void> {
  await Promise.all(
    a_collection_list.map(
      async (a_collection) => {
        await deleteCollection(collection(a_firestore_ref, a_collection))
      }
    )
  )
}

async function deleteCollection(
  a_collection: CollectionReference,
) {
  const docs = await getDocs(query(a_collection))
  await Promise.all(
    docs.docs.map(
      async (doc) => {
        await deleteDoc(doc.ref)
      }
    )
  )
}
