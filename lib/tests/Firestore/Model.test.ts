import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { BuildFirestore } from "@src/Firestore/index.js";
import { BuildFirebase } from "@src/Services.js";
import { cleanCollections } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import dotenv from "dotenv";
dotenv.config();

import { afterAll, describe, expect, it } from "vitest";

describe("Firestore MODEL", async () => {
  interface TestData {
    name: string;
    date: Date;
    anArray: [{ num: number }];
  }

  const aTestDataMock: TestData = {
    name: "mock",
    date: new Date(),
    anArray: [{ num: 1 }]
  };

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

  describe("CREATE", () => {
    describe("DEFAULT", () => {
      const REPO_DEFAULT = BuildFirestore(FIRESTORE_WEB).model<TestData>("test");

      it("should create a data successfully", async () => {
        const aNewData = await REPO_DEFAULT.create(aTestDataMock);
        expect(aNewData).toHaveProperty("_id");
        expect(aNewData._id.length > 0).toBe(true);
        expect(aNewData.date).toStrictEqual(aTestDataMock.date);
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

    describe("CUSTOM ID", () => {
      const REPO_ID = BuildFirestore(FIRESTORE_WEB).model<TestData>("test", { customId: true });

      it("should create a data successfully", async () => {
        const custom_id = "custom_id";
        const aNewData = await REPO_ID.create(aTestDataMock, custom_id);
        expect(aNewData).toHaveProperty("_id");
        expect(aNewData._id).toBe(custom_id);
        expect(aNewData.date).toStrictEqual(aTestDataMock.date);
      });

      it("should error default config with 'customId'", async () => {
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
    });

    describe("WITH TIMESTAMPS", () => {
      const REPO_TIME = BuildFirestore(FIRESTORE_WEB).model<TestData, "TIMESTAMP_ENABLE">("test", {
        addTimestamps: true
      });

      it("should create a data successfully", async () => {
        const aNewData = await REPO_TIME.create(aTestDataMock);
        expect(aNewData).toHaveProperty("_id");
        expect(aNewData._id.length > 0).toBe(true);
        expect(aNewData).toHaveProperty("_createdAt");
        expect(aNewData._createdAt).instanceOf(Date);
        expect(aNewData).toHaveProperty("_updatedAt");
        expect(aNewData._updatedAt).instanceOf(Date);
        expect(aNewData.date).toStrictEqual(aTestDataMock.date);
      });
    });

    describe("ALL", () => {
      const REPO_ALL = BuildFirestore(FIRESTORE_WEB).model<TestData, "TIMESTAMP_ENABLE">("test", {
        customId: true,
        addTimestamps: true
      });

      it("should create a data successfully", async () => {
        const custom_id = "custom_id_all";
        const aNewData = await REPO_ALL.create(aTestDataMock, custom_id);
        expect(aNewData).toHaveProperty("_id");
        expect(aNewData._id).toBe(custom_id);
        expect(aNewData).toHaveProperty("_createdAt");
        expect(aNewData._createdAt).instanceOf(Date);
        expect(aNewData).toHaveProperty("_updatedAt");
        expect(aNewData._updatedAt).instanceOf(Date);
        expect(aNewData.date).toStrictEqual(aTestDataMock.date);
      });
    });
  });
});
