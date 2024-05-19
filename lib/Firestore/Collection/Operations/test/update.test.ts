import { SimpleDocumentDefaultMock } from "@src/Firestore/Document/document-mock.js"
import { BuildServicesTest } from "@src/tests-helpers/build-services.js"
import { afterAll, describe, expect, it } from "vitest"

import { cleanCollections } from "../tests-helpers/clean-collections.js"
import { updateWithId, updateWithReference } from "../update.js"

describe("Firestore Update", async () => {
  afterAll(async () => {
    const { FIRESTORE_WEB } = await BuildServicesTest()
    await cleanCollections(FIRESTORE_WEB, ["test"])
  })

  it("Should update with Document", async () => {
    const a_doc = await SimpleDocumentDefaultMock()
    const a_new_data = { text: "new" }
    const a_new_doc = await updateWithReference(a_doc, a_new_data)
    expect(a_new_doc.data?.text).toBe(a_new_data.text)
  })

  it("Should update with ID", async () => {
    const a_doc = await SimpleDocumentDefaultMock()
    const a_new_data = { text: "new" }
    const a_new_doc = await updateWithId(
      {
        $COLLECTION: a_doc.$COLLECTION,
        $SCHEMA: a_doc.$SCHEMA,
        $PATH: a_doc.$PATH
      },
      a_doc.id,
      a_new_data
    )
    expect(a_new_doc.data?.text).toBe(a_new_data.text)
  })
})
