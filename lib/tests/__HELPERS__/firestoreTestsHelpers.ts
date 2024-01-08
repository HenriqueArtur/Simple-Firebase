import { BuildFirebase } from "@src/Services.js";
import dotenv from "dotenv";
dotenv.config();

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

export async function FirebaseObject() {
  return await BuildFirebase(
    {
      apiKey: process.env!.API_KEY as string,
      authDomain: process.env!.AUTH_DOMAIN as string,
      projectId: process.env!.PROJECT_ID as string,
      storageBucket: process.env!.STORAGE_BUCKET as string,
      messagingSenderId: process.env!.MESSAGING_SENDER_ID as string,
      appId: process.env!.APP_ID as string
    },
    "Simple Firebase",
    "test"
  );
}
