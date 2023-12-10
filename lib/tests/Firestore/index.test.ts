import { BuildFirestore } from "@src/Firestore/index.js";
import { BuildFirebase } from "@src/Services.js";
import dotenv from "dotenv";
dotenv.config();

import { describe, expect, it } from "vitest";

describe("FIREBASE Firestore", async () => {
  const { FIRESTORE_WEB } = await BuildFirebase(
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

  it("should instantiate Firebase Firestore", async () => {
    const repository = BuildFirestore(FIRESTORE_WEB);
    expect(Object.keys(repository)).toHaveLength(1);
    expect(repository).toHaveProperty("model");
  });
});
