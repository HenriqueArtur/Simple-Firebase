import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js"
import { BuildFirestore } from "@src/Firestore/index.js"
import { describe, expect, it } from "vitest"

describe("FIREBASE Firestore", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject()

  it("should instantiate Firebase Firestore", async () => {
    const repository = BuildFirestore(FIRESTORE_WEB)
    const repository_keys_size = 1
    expect(Object.keys(repository)).toHaveLength(repository_keys_size)
    expect(repository).toHaveProperty("collection")
  })
})
