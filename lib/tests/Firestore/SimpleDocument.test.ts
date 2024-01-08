import { describe, expect, it } from "vitest";
import { FirebaseObject } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { Timestamp, collection } from "firebase/firestore";
import { ID } from "@src/types.js";
import { CollectionOptions } from "@src/Firestore/Collection.js";
import { formatSimpleDocument } from "@src/Firestore/SimpleDocument.js";

interface TestData {
  name: string;
  date: Timestamp;
  anArray: [{ num: number }];
}

const aTestDataMock: TestData = {
  name: "mock",
  date: Timestamp.now(),
  anArray: [{ num: 1 }]
};

const anId: ID = "fakerId";

const anOpt: CollectionOptions = {
  customId: false,
  addTimestamps: true
};

describe("Simple Document", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aParentCollection = collection(FIRESTORE_WEB, "test");

  describe("formatSimpleDocument/4", () => {
    it("should return a complete document", () => {
      const aSimpleDocument = formatSimpleDocument<TestData>(
        anId,
        aTestDataMock,
        anOpt,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(5);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeUndefined();
      expect(aSimpleDocument.updatedAt).toBeUndefined();
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(aTestDataMock);
    });

    it("should return a data with timestamps", () => {
      const aSimpleDocument = formatSimpleDocument<TestData>(
        anId,
        {
          ...aTestDataMock,
          _createdAt: Timestamp.now(),
          _updatedAt: Timestamp.now()
        },
        anOpt,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(5);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.updatedAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(aTestDataMock);
    });
  });
});
