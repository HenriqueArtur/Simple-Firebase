import { describe, expect, it } from "vitest";
import { FirebaseObject } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { Timestamp, collection } from "firebase/firestore";
import { formatSimpleDocument } from "@src/Firestore/SimpleDocument.js";
import { TestData } from "@tests/__HELPERS__/typeHelpers.js";
import {
  TEST_DATA_MOCK,
  TEST_DEFAULT_OPTIONS,
  TEST_ID_MOCK
} from "@tests/__HELPERS__/dataHelpers.js";

describe("Simple Document", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aParentCollection = collection(FIRESTORE_WEB, "test");

  describe("formatSimpleDocument/4", () => {
    it("should return a complete document", () => {
      const aSimpleDocument = formatSimpleDocument<TestData>(
        TEST_ID_MOCK,
        TEST_DATA_MOCK,
        TEST_DEFAULT_OPTIONS,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(5);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeUndefined();
      expect(aSimpleDocument.updatedAt).toBeUndefined();
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(TEST_DATA_MOCK);
    });

    it("should return a data with timestamps", () => {
      const aSimpleDocument = formatSimpleDocument<TestData>(
        TEST_ID_MOCK,
        {
          ...TEST_DATA_MOCK,
          _createdAt: Timestamp.now(),
          _updatedAt: Timestamp.now()
        },
        TEST_DEFAULT_OPTIONS,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(5);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.updatedAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(TEST_DATA_MOCK);
    });
  });
});
