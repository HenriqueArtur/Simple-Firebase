import dotenv from "dotenv";
dotenv.config();

import { BuildFirebaseAuth } from "@src/Auth/index.js";
import { BuildFirebase } from "@src/Services.js";
import { describe, expect, it } from "vitest";

describe("FIREBASE WEB Auth", async () => {
  const { AUTH_WEB } = await BuildFirebase(
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

  it("should instantiate Firebase Auth", async () => {
    const auth = BuildFirebaseAuth(AUTH_WEB);
    expect(auth).toHaveProperty("signInWithEmail");
    expect(auth).toHaveProperty("signOut");
    expect(auth).toHaveProperty("isLoggedIn");
  });
});
