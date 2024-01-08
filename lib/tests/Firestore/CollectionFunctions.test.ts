import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { FirebaseObject, cleanCollections } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { afterAll, describe, expect, it } from "vitest";
import { BuildFunctions } from "@src/Firestore/CollectionFunctions.js";
import { SubColTestData, TestData } from "@tests/__HELPERS__/typeHelpers.js";
import { TEST_DATA_MOCK } from "@tests/__HELPERS__/dataHelpers.js";

describe("Collections Functions", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aCollection = collection(FIRESTORE_WEB, "test");

  afterAll(async () => {
    await cleanCollections(FIRESTORE_WEB, ["test"]);
  });

  describe("BuildFunctions/2", () => {
    it("should instantiate functions", () => {
      const aCollection = collection(FIRESTORE_WEB, "test");
      const theFunctions = BuildFunctions<TestData>(aCollection, {
        customId: false,
        addTimestamps: true
      });
      expect(Object.keys(theFunctions)).toHaveLength(5);
      expect(theFunctions).toHaveProperty("create");
      expect(theFunctions).toHaveProperty("delete");
      expect(theFunctions).toHaveProperty("find");
      expect(theFunctions).toHaveProperty("findById");
      expect(theFunctions).toHaveProperty("update");
    });
  });

  describe("functions", () => {
    describe("create/2", () => {
      describe("Options DEFAULT", () => {
        const REPO_DEFAULT = BuildFunctions<TestData>(aCollection, {
          customId: false,
          addTimestamps: true
        });

        it("should create a data successfully", async () => {
          const aNewData = await REPO_DEFAULT.create(TEST_DATA_MOCK);
          expect(Object.keys(aNewData)).toHaveLength(5);
          expect(aNewData).toHaveProperty("id");
          expect(aNewData).toHaveProperty("data");
          expect(aNewData).toHaveProperty("subCollection");
          expect(aNewData).toHaveProperty("createdAt");
          expect(aNewData).toHaveProperty("updatedAt");
          expect(aNewData.id.length > 0).toBe(true);
          expect(aNewData.data.name).toStrictEqual(TEST_DATA_MOCK.name);
          expect(aNewData.data.anArray).toStrictEqual(TEST_DATA_MOCK.anArray);
          expect(aNewData.data.date).instanceOf(Timestamp);
          expect(aNewData.subCollection).toBeTypeOf("function");
          expect(aNewData.updatedAt).instanceOf(Timestamp);
          expect(aNewData.createdAt).instanceOf(Timestamp);
        });

        it("should error default config with 'customId'", async () => {
          const error = new SimpleFirebaseFirestoreError(
            '"customId" is not needed if option "customId" was disabled.'
          );
          try {
            expect(await REPO_DEFAULT.create(TEST_DATA_MOCK, "wrong_id")).toThrow(error);
          } catch (err: any) {
            expect(err).toHaveProperty("message");
            expect(err.message).toBe(error.message);
          }
        });
      });

      describe("Options CUSTOM ID", () => {
        const REPO_ID = BuildFunctions<TestData>(aCollection, {
          customId: true,
          addTimestamps: false
        });

        it("should create a data successfully", async () => {
          const custom_id = "custom_id";
          const aNewData = await REPO_ID.create(TEST_DATA_MOCK, custom_id);
          expect(aNewData.id).toBe(custom_id);
          expect(aNewData.data.name).toStrictEqual(TEST_DATA_MOCK.name);
          expect(aNewData.data.anArray).toStrictEqual(TEST_DATA_MOCK.anArray);
          expect(aNewData.data.date).toHaveProperty("nanoseconds");
          expect(aNewData.data.date).toHaveProperty("seconds");
          expect(aNewData.subCollection).toBeTypeOf("function");
          expect(aNewData.updatedAt).toBeUndefined();
          expect(aNewData.createdAt).toBeUndefined();
        });

        it("should error config with 'customId'", async () => {
          const error = new SimpleFirebaseFirestoreError(
            '"customId" is needed if option "customId" was enabled.'
          );
          try {
            expect(await REPO_ID.create(TEST_DATA_MOCK)).toThrow(error);
          } catch (err: any) {
            expect(err).toHaveProperty("message");
            expect(err.message).toBe(error.message);
          }
        });

        it("should error document already exists", async () => {
          const customId = "existing_custom_id";
          const col = collection(FIRESTORE_WEB, "test");
          const aDocRef = doc(col, customId);
          await setDoc(aDocRef, { exist: true });
          const error = new SimpleFirebaseFirestoreError(`Document "${customId}" already exists.`);
          try {
            expect(await REPO_ID.create(TEST_DATA_MOCK, customId)).toThrow(error);
          } catch (err: any) {
            expect(err).toHaveProperty("message");
            expect(err.message).toBe(error.message);
          }
        });
      });

      describe("Options WITHOUT TIMESTAMPS", () => {
        const REPO_TIME = BuildFunctions<TestData>(aCollection, {
          customId: false,
          addTimestamps: false
        });

        it("should create a data successfully", async () => {
          const aNewData = await REPO_TIME.create(TEST_DATA_MOCK);
          expect(aNewData.updatedAt).toBeUndefined();
          expect(aNewData.createdAt).toBeUndefined();
        });
      });

      describe("Options ALL configs true", () => {
        const REPO_ALL = BuildFunctions<TestData>(aCollection, {
          customId: true,
          addTimestamps: true
        });

        it("should create a data successfully", async () => {
          const custom_id = "custom_id_all";
          const aNewData = await REPO_ALL.create(TEST_DATA_MOCK, custom_id);
          expect(aNewData).toHaveProperty("id");
          expect(aNewData).toHaveProperty("data");
          expect(aNewData).toHaveProperty("subCollection");
          expect(aNewData).toHaveProperty("createdAt");
          expect(aNewData).toHaveProperty("updatedAt");
          expect(aNewData.id).toBe(custom_id);
          expect(aNewData.data.name).toStrictEqual(TEST_DATA_MOCK.name);
          expect(aNewData.data.anArray).toStrictEqual(TEST_DATA_MOCK.anArray);
          expect(aNewData.data.date).instanceOf(Timestamp);
          expect(aNewData.subCollection).toBeTypeOf("function");
          expect(aNewData.updatedAt).not.toBeUndefined();
          expect(aNewData.createdAt).not.toBeUndefined();
        });
      });
    });
  });

  describe("SUB COLLECTIONS", () => {
    describe("create/2", async () => {
      const FUNCTIONS = BuildFunctions<TestData, { sub: SubColTestData }>(aCollection, {
        customId: false,
        addTimestamps: true
      });
      const aParentData = await FUNCTIONS.create(TEST_DATA_MOCK);

      it("should create a data successfully", async () => {
        const aNewDataMock: SubColTestData = { phone: "+55" };
        const aNewData = await aParentData.subCollection("sub").create(aNewDataMock);
        expect(Object.keys(aNewData)).toHaveLength(5);
        expect(aNewData).toHaveProperty("id");
        expect(aNewData).toHaveProperty("data");
        expect(aNewData).toHaveProperty("subCollection");
        expect(aNewData).toHaveProperty("createdAt");
        expect(aNewData).toHaveProperty("updatedAt");
        expect(aNewData.id.length > 0).toBe(true);
        expect(aNewData.data.phone).toStrictEqual(aNewDataMock.phone);
        expect(aNewData.subCollection).toBeTypeOf("function");
        expect(aNewData.updatedAt).instanceOf(Timestamp);
        expect(aNewData.createdAt).instanceOf(Timestamp);
      });
    });
  });
});
