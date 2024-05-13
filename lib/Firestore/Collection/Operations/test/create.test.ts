import { BuildServicesTest } from "@src/tests-helpers/build-services.js"
import { afterAll, describe, expect, it } from "vitest"

import { CollectionBaseDefaultMock } from "../../collection-mock.js"
import { createInFirebaseAutoId, createInFirebaseCustomId } from "../create.js"
import { cleanCollections } from "../tests-helpers/clean-collections.js"

describe("Firestore Create", async () => {
  afterAll(async () => {
    const { FIRESTORE_WEB } = await BuildServicesTest()
    await cleanCollections(FIRESTORE_WEB, ["test"])
  })

  const { $COLLECTION } = await CollectionBaseDefaultMock()
  const CREATIONS_KEYS_LENGTH = 3

  it("should create a document with auto id", async () => {
    const a_new_data = { key: "value" }
    const response = await createInFirebaseAutoId($COLLECTION, a_new_data)
    expect(Object.keys(response)).toHaveLength(CREATIONS_KEYS_LENGTH)
    expect(response).toHaveProperty("data")
    expect(response.data).toStrictEqual(a_new_data)
    expect(response).toHaveProperty("id")
    expect(response.id).not.toBeNull()
    expect(response).toHaveProperty("reference")
    expect(response.reference).not.toBeNull()
  })

  it("should create a document with custom id", async () => {
    const a_custom_id = "custom_id"
    const a_new_data = { key: "value" }
    const response = await createInFirebaseCustomId(
      $COLLECTION,
      a_new_data,
      { custom_id: a_custom_id }
    )
    expect(Object.keys(response)).toHaveLength(CREATIONS_KEYS_LENGTH)
    expect(response).toHaveProperty("data")
    expect(response.data).toStrictEqual(a_new_data)
    expect(response).toHaveProperty("id")
    expect(response.id).toBe(a_custom_id)
    expect(response).toHaveProperty("reference")
    expect(response.reference).not.toBeNull()
  })

  it("should ERROR on create a document with custom id", async () => {
    const a_custom_id = "custom_id"
    const a_new_data = { key: "value" }
    try {
      await createInFirebaseCustomId(
        $COLLECTION,
        a_new_data,
        { custom_id: a_custom_id }
      )
    } catch (error: unknown) {
      expect(error).instanceOf(Error)
      expect((error as Error).message).toBe(`Document "${a_custom_id}" already exists.`)
    }
  })
})
