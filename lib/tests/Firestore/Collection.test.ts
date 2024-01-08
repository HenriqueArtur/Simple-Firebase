import { FirebaseObject, cleanCollections } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { Timestamp, collection } from "firebase/firestore";
import { afterAll, describe, expect, it } from "vitest";
import {
  Collection,
  CollectionOptions,
  SubCollection,
  setOptions
} from "@src/Firestore/Collection.js";

interface TestData {
  name: string;
  date: Timestamp;
  anArray: [{ num: number }];
}

const aTestOptions: CollectionOptions = {
  customId: false,
  addTimestamps: false
};

describe("COLLECTION", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();

  afterAll(async () => {
    await cleanCollections(FIRESTORE_WEB, ["test"]);
  });

  describe("Collection/3", () => {
    it("should instantiate a Collection", () => {
      const aCollection = Collection<TestData>(FIRESTORE_WEB, "test", aTestOptions);
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
        aTestOptions
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
