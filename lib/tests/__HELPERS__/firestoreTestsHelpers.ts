import dotenv from "dotenv";
dotenv.config();

import { BuildFirebase } from "@src/Services.js";
import {
  CollectionReference,
  Firestore,
  collection,
  deleteDoc,
  getDocs,
  query
} from "firebase/firestore";

type DeleteCollections = {
  name: string;
  subCollections?: DeleteCollections[];
};

export async function cleanCollections(
  aFirestoreRef: Firestore,
  collections: DeleteCollections[]
): Promise<void> {
  for (const { name, subCollections } of collections) {
    const COL = collection(aFirestoreRef, name);
    await deleteCollection(COL, subCollections);
  }
}

async function deleteCollection(
  aCollection: CollectionReference,
  subCollections?: DeleteCollections[]
) {
  const docs = await getDocs(query(aCollection));
  for (const doc of docs.docs) {
    if (subCollections && subCollections.length > 0) {
      for (const { name, subCollections: currentSub } of subCollections) {
        const aSubCollection = collection(aCollection, doc.id, name);
        await deleteCollection(aSubCollection, currentSub);
      }
    }
    await deleteDoc(doc.ref);
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
    { env: "test" }
  );
}
