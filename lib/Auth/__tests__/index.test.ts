import { BuildFirebaseAuth } from "@src/Auth/index.js";
import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js";
import { describe, expect, it } from "vitest";

describe("FIREBASE WEB Auth", async () => {
  const { AUTH_WEB } = await FirebaseObject();

  it("should instantiate Firebase Auth", async () => {
    const auth = BuildFirebaseAuth(AUTH_WEB);
    expect(auth).toHaveProperty("signInWithEmail");
    expect(auth).toHaveProperty("signOut");
    expect(auth).toHaveProperty("isLoggedIn");
  });
});
