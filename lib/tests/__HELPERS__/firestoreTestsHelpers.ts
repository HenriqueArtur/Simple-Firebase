import { Firestore, collection, deleteDoc, getDocs, query } from "firebase/firestore";

export async function cleanCollections(
  aFirestoreRef: Firestore,
  collections: string[]
): Promise<void> {
  for (const path of collections) {
    const COL = collection(aFirestoreRef, path);
    const docs = await getDocs(query(COL));
    for (const doc of docs.docs) {
      await deleteDoc(doc.ref);
    }
  }
}
