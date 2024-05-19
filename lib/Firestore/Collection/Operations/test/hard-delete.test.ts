import { BuildServicesTest } from "@src/tests/helpers/build-services.js"
import { doc, getDoc } from "firebase/firestore"
import { afterAll, describe, expect, it } from "vitest"

import { CollectionBaseDefaultMock } from "../../collection-mock.js"
import { hardDelete } from "../hard-delete.js"
import { cleanCollections } from "./helpers/clean-collections.js"
import { createATestDefaultObject } from "./helpers/create-test-default-object.js"

describe("Firestore Hard Delete", async () => {
  afterAll(async () => {
    const { FIRESTORE_WEB } = await BuildServicesTest()
    await cleanCollections(FIRESTORE_WEB, ["test"])
  })

  const $SIMPLE_COLLECTION = await CollectionBaseDefaultMock()

  it("Should delete a Document", async () => {
    const an_id = "a_id"
    const a_data = { key: "value" }
    await createATestDefaultObject($SIMPLE_COLLECTION.$COLLECTION, a_data, an_id)
    await hardDelete($SIMPLE_COLLECTION, an_id)
    const a_doc = await getDoc(doc($SIMPLE_COLLECTION.$COLLECTION, an_id))
    expect(a_doc.exists()).toBeFalsy()
  })
})
