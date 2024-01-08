import { FirebaseObject } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { collection } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { Collection, SubCollection, setOptions } from "@src/Firestore/Collection.js";
import { TEST_DEFAULT_OPTIONS } from "@tests/__HELPERS__/dataHelpers.js";
import { TestData } from "@tests/__HELPERS__/typeHelpers.js";

describe("COLLECTION", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();

  describe("Collection/3", () => {
    it("should instantiate a Collection", () => {
      const aCollection = Collection<TestData>(FIRESTORE_WEB, "test", TEST_DEFAULT_OPTIONS);
      expect(Object.keys(aCollection)).toHaveLength(5);
      expect(aCollection).toHaveProperty("create");
      expect(aCollection).toHaveProperty("delete");
      expect(aCollection).toHaveProperty("find");
      expect(aCollection).toHaveProperty("findById");
      expect(aCollection).toHaveProperty("update");
    });
  });

  describe("SubCollection/3", () => {
    it("should instantiate a SubCollection", () => {
      const aParentCollection = collection(FIRESTORE_WEB, "test");
      const aCollection = SubCollection<TestData>(
        aParentCollection,
        "fakerId",
        "subCollection",
        TEST_DEFAULT_OPTIONS
      );
      expect(Object.keys(aCollection)).toHaveLength(5);
      expect(aCollection).toHaveProperty("create");
      expect(aCollection).toHaveProperty("delete");
      expect(aCollection).toHaveProperty("find");
      expect(aCollection).toHaveProperty("findById");
      expect(aCollection).toHaveProperty("update");
    });
  });

  describe("setOptions/2", () => {
    it("should return a default options", () => {
      const aNewOpt = setOptions();
      expect(Object.keys(aNewOpt)).toHaveLength(2);
      expect(aNewOpt.customId).toBe(false);
      expect(aNewOpt.addTimestamps).toBe(true);
    });

    it("should set 'customId'", () => {
      const aNewOpt = setOptions({
        customId: true
      });
      expect(aNewOpt.customId).toBe(true);
    });

    it("should set 'addTimestamps'", () => {
      const aNewOpt = setOptions({
        addTimestamps: false
      });
      expect(aNewOpt.addTimestamps).toBe(false);
    });

    it("should set all options", () => {
      const aNewOpt = setOptions({
        customId: true,
        addTimestamps: false
      });
      expect(aNewOpt.customId).toBe(true);
      expect(aNewOpt.addTimestamps).toBe(false);
    });
  });
});
