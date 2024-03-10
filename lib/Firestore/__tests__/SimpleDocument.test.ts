import { describe, expect, it } from "vitest";
import { FirebaseObject } from "@src/__HELPERS__/firestoreTestsHelpers.js";
import { DocumentSnapshot, Timestamp, collection } from "firebase/firestore";
import { formatSimpleDocument } from "@src/Firestore/SimpleDocument.js";
import { TestData } from "@src/__HELPERS__/typeHelpers.js";
import {
  TEST_DATA_MOCK,
  TEST_DEFAULT_OPTIONS,
  TEST_ID_MOCK
} from "@src/__HELPERS__/dataHelpers.js";

describe("Simple Document", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aParentCollection = collection(FIRESTORE_WEB, "test");

  describe("formatSimpleDocument/4", () => {
    it("should return a complete document", () => {
      const aDoc = {
        data: () => TEST_DATA_MOCK,
        id: TEST_ID_MOCK
      };
      const aSimpleDocument = formatSimpleDocument<TestData>(
        // @ts-ignore
        aDoc as DocumentSnapshot,
        TEST_DEFAULT_OPTIONS,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(6);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeUndefined();
      expect(aSimpleDocument.updatedAt).toBeUndefined();
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(TEST_DATA_MOCK);
    });

    it("should return a data with timestamps", () => {
      const aDoc = {
        data: () => ({
          ...TEST_DATA_MOCK,
          _createdAt: Timestamp.now(),
          _updatedAt: Timestamp.now()
        }),
        id: TEST_ID_MOCK
      };
      const aSimpleDocument = formatSimpleDocument<TestData>(
        // @ts-ignore
        aDoc as DocumentSnapshot,
        TEST_DEFAULT_OPTIONS,
        aParentCollection
      );
      expect(Object.keys(aSimpleDocument)).toHaveLength(6);
      expect(aSimpleDocument.id).toBeTypeOf("string");
      expect(aSimpleDocument.data).toBeTypeOf("object");
      expect(aSimpleDocument.createdAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.updatedAt).toBeInstanceOf(Timestamp);
      expect(aSimpleDocument.subCollection).toBeTypeOf("function");
      expect(aSimpleDocument.data).toStrictEqual(TEST_DATA_MOCK);
    });
  });
});
