import { BuildServicesTest } from "@src/tests/helpers/build-services.js"
import { afterAll, describe, expect, it } from "vitest"

import { CollectionBaseDefaultMock } from "../../collection-mock.js"
import { findMany } from "../find-many.js"
import { cleanCollections } from "./helpers/clean-collections.js"
import { createATestDefaultObject } from "./helpers/create-test-default-object.js"

describe("Firestore Find Many", async () => {
  afterAll(async () => {
    const { FIRESTORE_WEB } = await BuildServicesTest()
    await cleanCollections(FIRESTORE_WEB, ["test"])
  })

  const $SIMPLE_COLLECTION = await CollectionBaseDefaultMock()
  await Promise.all([
    createATestDefaultObject(
      $SIMPLE_COLLECTION.$COLLECTION,
      { text: "value" },
      "1"
    ),
    createATestDefaultObject(
      $SIMPLE_COLLECTION.$COLLECTION,
      { text: "value" },
      "2"
    ),
    createATestDefaultObject(
      $SIMPLE_COLLECTION.$COLLECTION,
      { text: "not_value" },
      "3"
    ),
  ])

  it("Should find 2 documents", async () => {
    const a_docs = await findMany(
      $SIMPLE_COLLECTION,
      { where: { text: "value" } }
    )
    expect(a_docs.docs()).toHaveLength(2)
  })
})
