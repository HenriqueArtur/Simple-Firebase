import { BuildFirestore } from "@src/Firestore/index.js";
import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js";
import { describe, expect, it } from "vitest";

describe("FIREBASE Firestore", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();

  it("should instantiate Firebase Firestore", async () => {
    const repository = BuildFirestore(FIRESTORE_WEB);
    expect(Object.keys(repository)).toHaveLength(1);
    expect(repository).toHaveProperty("collection");
  });
});
