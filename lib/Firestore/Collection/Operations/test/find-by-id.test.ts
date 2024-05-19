import { BuildServicesTest } from "@src/tests-helpers/build-services.js"
import { afterAll, describe, expect, it } from "vitest"

import { CollectionBaseDefaultMock } from "../../collection-mock.js"
import { findById } from "../find-by-id.js"
import { cleanCollections } from "./helpers/clean-collections.js"
import { createATestDefaultObject } from "./helpers/create-test-default-object.js"

describe("Firestore Find by ID", async () => {
  afterAll(async () => {
    const { FIRESTORE_WEB } = await BuildServicesTest()
    await cleanCollections(FIRESTORE_WEB, ["test"])
  })

  const $SIMPLE_COLLECTION = await CollectionBaseDefaultMock()
  const FIND_BY_ID_KEYS_LENGTH = 6

  it("Shoud NOT find a Document", async () => {
    const a_wrong_id = "a_wrong_id"
    const response = await findById($SIMPLE_COLLECTION, a_wrong_id)
    expect(Object.keys(response)).toHaveLength(FIND_BY_ID_KEYS_LENGTH)
    expect(response).toHaveProperty("data")
    expect(response.data).toBeUndefined()
    expect(response).toHaveProperty("id")
    expect(response.id).not.toBeNull()
    expect(response).toHaveProperty("$COLLECTION")
    expect(response).toHaveProperty("$PATH")
    expect(response).toHaveProperty("$SCHEMA")
    expect(response).toHaveProperty("$REFERENCE")
  })

  it("Shoud find a Document", async () => {
    const an_id = "a_id"
    const a_data = { key: "value" }
    await createATestDefaultObject($SIMPLE_COLLECTION.$COLLECTION, a_data, an_id)
    const response = await findById($SIMPLE_COLLECTION, an_id)
    expect(Object.keys(response)).toHaveLength(FIND_BY_ID_KEYS_LENGTH)
    expect(response).toHaveProperty("data")
    expect(response.data).toStrictEqual(a_data)
    expect(response).toHaveProperty("id")
    expect(response.id).not.toBeNull()
    expect(response).toHaveProperty("$COLLECTION")
    expect(response).toHaveProperty("$PATH")
    expect(response).toHaveProperty("$SCHEMA")
    expect(response).toHaveProperty("$REFERENCE")
  })
})
