import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { FirebaseObject, cleanCollections } from "@src/__HELPERS__/firestoreTestsHelpers.js";
import { DocumentSnapshot, Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { afterAll, describe, expect, it } from "vitest";
import { BuildFunctions } from "@src/Firestore/CollectionFunctions.js";
import { SubColTestData, TestData } from "@src/__HELPERS__/typeHelpers.js";
import { TEST_DATA_MOCK, TEST_DEFAULT_OPTIONS } from "@src/__HELPERS__/dataHelpers.js";
import { registerTestData } from "@src/__HELPERS__/registerData.js";
import { TestDataMock } from "@src/__MOCKS__/TestDataMock.js";

describe("Collections Functions", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aCollection = collection(FIRESTORE_WEB, "test");

  afterAll(async () => {
    await cleanCollections(FIRESTORE_WEB, [{ name: "test", subCollections: [{ name: "sub" }] }]);
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
          expect(Object.keys(aNewData)).toHaveLength(6);
          expect(aNewData).toHaveProperty("id");
          expect(aNewData).toHaveProperty("data");
          expect(aNewData).toHaveProperty("subCollection");
          expect(aNewData).toHaveProperty("createdAt");
          expect(aNewData).toHaveProperty("updatedAt");
          expect(aNewData).toHaveProperty("originalDoc");
          expect(aNewData.id.length > 0).toBe(true);
          expect(aNewData.data.name).toStrictEqual(TEST_DATA_MOCK.name);
          expect(aNewData.data.anArray).toStrictEqual(TEST_DATA_MOCK.anArray);
          expect(aNewData.data.date).instanceOf(Timestamp);
          expect(aNewData.subCollection).toBeTypeOf("function");
          expect(aNewData.updatedAt).instanceOf(Timestamp);
          expect(aNewData.createdAt).instanceOf(Timestamp);
          expect(aNewData.originalDoc).instanceOf(DocumentSnapshot);
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
          expect(aNewData.originalDoc).instanceOf(DocumentSnapshot);
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
          expect(aNewData.originalDoc).instanceOf(DocumentSnapshot);
        });
      });
    });

    describe("find/1", () => {
      const FUNCTIONS = BuildFunctions<TestData>(aCollection, TEST_DEFAULT_OPTIONS);

      it("should not find any document", async () => {
        const response = await FUNCTIONS.find({
          where: {
            name: "banana"
          }
        });
        expect(response.docsFoundUntilNow).toBe(0);
        expect(response.page).toBe(0);
        expect(response.limit).toBe("ALL");
        expect(response.isLastPage).toBe(true);
        expect(response.docs).toHaveLength(0);
        expect(response.nextPage).toBeTypeOf("function");
      });

      it("should find 2 document", async () => {
        await Promise.all([
          FUNCTIONS.create(TestDataMock({ number: 0 })),
          FUNCTIONS.create(TestDataMock({ number: 20 })),
          FUNCTIONS.create(TestDataMock({ number: 50 })),
          FUNCTIONS.create(TestDataMock({ number: 95 }))
        ]);

        const response = await FUNCTIONS.find({
          where: {
            number: {
              $GREATER: 10,
              $LESS: 90
            }
          }
        });
        expect(response.docsFoundUntilNow).toBe(2);
        expect(response.page).toBe(0);
        expect(response.limit).toBe("ALL");
        expect(response.isLastPage).toBe(true);
        expect(response.docs).toHaveLength(2);
        expect(response.nextPage).toBeTypeOf("function");
      });

      it("should find 1 document paginate with limit 1", async () => {
        await Promise.all([
          FUNCTIONS.create(TestDataMock({ number: 1 })),
          FUNCTIONS.create(TestDataMock({ number: 120 })),
          FUNCTIONS.create(TestDataMock({ number: 150 })),
          FUNCTIONS.create(TestDataMock({ number: 195 }))
        ]);

        const response = await FUNCTIONS.find({
          where: {
            number: {
              $GREATER: 110,
              $LESS: 190
            }
          },
          orderBy: {
            number: "ASC"
          },
          limit: 1
        });
        expect(response.docsFoundUntilNow).toBe(1);
        expect(response.page).toBe(0);
        expect(response.limit).toBe(1);
        expect(response.isLastPage).toBe(false);
        expect(response.docs).toHaveLength(1);
      });
    });

    describe("findById/1", () => {
      const FUNCTIONS = BuildFunctions<TestData>(aCollection, TEST_DEFAULT_OPTIONS);

      it("should not find an document", async () => {
        expect(await FUNCTIONS.findById("fakerId")).toBeUndefined();
      });

      it("should not find", async () => {
        const aNewDoc = await registerTestData(FIRESTORE_WEB);
        const aDoc = await FUNCTIONS.findById(aNewDoc.id);
        expect(aDoc).not.toBeUndefined();
        expect(aDoc?.data).toStrictEqual(aNewDoc.data);
      });
    });

    describe("hardDelete/1", () => {
      const FUNCTIONS = BuildFunctions<TestData>(aCollection, TEST_DEFAULT_OPTIONS);

      it("should delete a document", async () => {
        const aNewDoc = await registerTestData(FIRESTORE_WEB);
        expect(await FUNCTIONS.delete(aNewDoc.id)).toBeUndefined();
        const aDoc = await FUNCTIONS.findById(aNewDoc.id);
        expect(aDoc).toBeUndefined();
      });
    });

    describe("update/2", () => {
      const FUNCTIONS = BuildFunctions<TestData>(aCollection, TEST_DEFAULT_OPTIONS);

      it("should throw an error document not exists", async () => {
        try {
          expect(await FUNCTIONS.update("fakerId", { name: "newName" })).toThrowError();
        } catch (error: any) {
          expect(error.code).toBe("not-found");
        }
      });

      it("should successfully update an document", async () => {
        const newValue = "new";
        const aDoc = await registerTestData(FIRESTORE_WEB);
        const anUpdatedDoc = await FUNCTIONS.update(aDoc.id, { nest: { key: newValue } });
        expect(anUpdatedDoc.data).toStrictEqual({
          ...aDoc.data,
          nest: {
            ...aDoc.data.nest,
            key: newValue
          }
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
        expect(Object.keys(aNewData)).toHaveLength(6);
        expect(aNewData).toHaveProperty("id");
        expect(aNewData).toHaveProperty("data");
        expect(aNewData).toHaveProperty("subCollection");
        expect(aNewData).toHaveProperty("createdAt");
        expect(aNewData).toHaveProperty("updatedAt");
        expect(aNewData).toHaveProperty("originalDoc");
        expect(aNewData.id.length > 0).toBe(true);
        expect(aNewData.data.phone).toStrictEqual(aNewDataMock.phone);
        expect(aNewData.subCollection).toBeTypeOf("function");
        expect(aNewData.updatedAt).instanceOf(Timestamp);
        expect(aNewData.createdAt).instanceOf(Timestamp);
        expect(aNewData.originalDoc).instanceOf(DocumentSnapshot);
      });
    });
  });
});
