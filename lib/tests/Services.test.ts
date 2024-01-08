import dotenv from "dotenv";
dotenv.config();

import { BuildFirebase, FirebaseConfig } from "@src/Services.js";
import { describe, expect, it } from "vitest";

describe("Firebase Web Build", () => {
  const config: FirebaseConfig = {
    apiKey: process.env!.API_KEY as string,
    authDomain: process.env!.AUTH_DOMAIN as string,
    projectId: process.env!.PROJECT_ID as string,
    storageBucket: process.env!.STORAGE_BUCKET as string,
    messagingSenderId: process.env!.MESSAGING_SENDER_ID as string,
    appId: process.env!.APP_ID as string
  };

  it("should create services", async () => {
    const { AUTH_WEB, CLOUD_FUNCTIONS_WEB, FIRESTORE_WEB } = await BuildFirebase(
      config,
      "Simple Firebase",
      { env: "test" }
    );
    expect(AUTH_WEB).not.toBeNull();
    expect(CLOUD_FUNCTIONS_WEB).not.toBeNull();
    expect(FIRESTORE_WEB).not.toBeNull();
  });

  it("should create services as singleton", async () => {
    const { AUTH_WEB, CLOUD_FUNCTIONS_WEB, FIRESTORE_WEB } = await BuildFirebase(
      config,
      "Simple Firebase",
      { env: "test" }
    );
    const {
      AUTH_WEB: AUTH_WEB_SINGLETON,
      CLOUD_FUNCTIONS_WEB: CLOUD_FUNCTIONS_WEB_SINGLETON,
      FIRESTORE_WEB: FIRESTORE_WEB_SINGLETON
    } = await BuildFirebase(config, "Simple Firebase", { env: "test" });
    expect(AUTH_WEB).toStrictEqual(AUTH_WEB_SINGLETON);
    expect(CLOUD_FUNCTIONS_WEB).toStrictEqual(CLOUD_FUNCTIONS_WEB_SINGLETON);
    expect(FIRESTORE_WEB).toStrictEqual(FIRESTORE_WEB_SINGLETON);
  });
});
