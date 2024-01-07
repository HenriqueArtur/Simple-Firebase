import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { BuildFirebase } from "@src/Services.js";
import { cleanCollections } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

import { afterAll, describe, expect, it } from "vitest";
import { BuildFunctions } from "@src/Firestore/CollectionFunctions.js";

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

describe("Collections Functions", async () => {
  const { FIRESTORE_WEB } = await BuildFirebase(
    {
      apiKey: process.env!.API_KEY as string,
      authDomain: process.env!.AUTH_DOMAIN as string,
      projectId: process.env!.PROJECT_ID as string,
      storageBucket: process.env!.STORAGE_BUCKET as string,
      messagingSenderId: process.env!.MESSAGING_SENDER_ID as string,
      appId: process.env!.APP_ID as string
    },
    "Simple Firebase",
    "test"
  );

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
    const aCollection = collection(FIRESTORE_WEB, "test");

    describe("create/2", () => {
      describe("Options DEFAULT", () => {
        const REPO_DEFAULT = BuildFunctions<TestData>(aCollection, {
          customId: false,
          addTimestamps: true
        });

        it("should create a data successfully", async () => {
          const aNewData = await REPO_DEFAULT.create(aTestDataMock);
          expect(Object.keys(aNewData)).toHaveLength(5);
          expect(aNewData).toHaveProperty("id");
          expect(aNewData).toHaveProperty("data");
          expect(aNewData).toHaveProperty("subCollection");
          expect(aNewData).toHaveProperty("createdAt");
          expect(aNewData).toHaveProperty("updatedAt");
          expect(aNewData.id.length > 0).toBe(true);
          expect(aNewData.data.name).toStrictEqual(aTestDataMock.name);
          expect(aNewData.data.anArray).toStrictEqual(aTestDataMock.anArray);
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
            expect(await REPO_DEFAULT.create(aTestDataMock, "wrong_id")).toThrow(error);
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
          const aNewData = await REPO_ID.create(aTestDataMock, custom_id);
          expect(aNewData.id).toBe(custom_id);
          expect(aNewData.data.name).toStrictEqual(aTestDataMock.name);
          expect(aNewData.data.anArray).toStrictEqual(aTestDataMock.anArray);
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
            expect(await REPO_ID.create(aTestDataMock)).toThrow(error);
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
            expect(await REPO_ID.create(aTestDataMock, customId)).toThrow(error);
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
          const aNewData = await REPO_TIME.create(aTestDataMock);
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
          const aNewData = await REPO_ALL.create(aTestDataMock, custom_id);
          expect(aNewData).toHaveProperty("id");
          expect(aNewData).toHaveProperty("data");
          expect(aNewData).toHaveProperty("subCollection");
          expect(aNewData).toHaveProperty("createdAt");
          expect(aNewData).toHaveProperty("updatedAt");
          expect(aNewData.id).toBe(custom_id);
          expect(aNewData.data.name).toStrictEqual(aTestDataMock.name);
          expect(aNewData.data.anArray).toStrictEqual(aTestDataMock.anArray);
          expect(aNewData.data.date).instanceOf(Timestamp);
          expect(aNewData.subCollection).toBeTypeOf("function");
          expect(aNewData.updatedAt).not.toBeUndefined();
          expect(aNewData.createdAt).not.toBeUndefined();
        });
      });
    });
  });
});
