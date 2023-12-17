import { FirestoreDateDoc, FirestoreDoc } from "@src/Firestore/FirestoreTypes.js";
import { formatData } from "@src/Firestore/helpers.js";
import { BuildFirebase } from "@src/Services.js";
import { ID } from "@src/types.js";
import { CollectionReference, Timestamp, collection } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import dotenv from "dotenv";
dotenv.config();

describe("Firestore HELPERS", async () => {
  interface TestData {
    aDate: Date;
    anArrayDates: Date[];
    anArrayObjDates: [{ aDate: Date }];
    aNested: {
      aDate: Date;
      aDoubleNested: {
        aDate: Date;
      };
    };
  }
  type TestDateFromFirestore = FirestoreDoc<TestData>;
  const _id: ID = "id";
  const aTimestamp: Timestamp = Timestamp.now();

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
  const COLLECTION = collection(FIRESTORE_WEB, "test") as CollectionReference<
    TestDateFromFirestore,
    FirestoreDateDoc<TestDateFromFirestore>
  >;

  it("should format date recursively", async () => {
    const aTestData = {
      aDate: aTimestamp,
      anArrayDates: [aTimestamp],
      anArrayObjDates: [{ aDate: aTimestamp }],
      aNested: {
        aDate: aTimestamp,
        aDoubleNested: {
          aDate: aTimestamp
        }
      }
    };

    const opt = {
      customId: true,
      addTimestamps: false,
      convertDocTimestampsToDate: true
    };

    const aNewData = formatData<TestDateFromFirestore, "USE_DATE">(
      _id,
      aTestData,
      opt,
      COLLECTION,
      []
    );

    expect(Object.keys(aNewData)).toHaveLength(5);
    expect(aNewData).toHaveProperty("id");
    expect(aNewData).toHaveProperty("data");
    expect(aNewData).toHaveProperty("subCollection");
    expect(aNewData).toHaveProperty("createdAt");
    expect(aNewData).toHaveProperty("updatedAt");
    expect(aNewData.id).toBe(_id);
    expect(aNewData.data.aDate).instanceOf(Date);
    expect(aNewData.data.anArrayDates).instanceOf(Array<Date>);
    expect(aNewData.data.anArrayObjDates).instanceOf(Array<{ aDate: Date }>);
    expect(aNewData.data.aNested.aDate).instanceOf(Date);
    expect(aNewData.data.aNested.aDoubleNested.aDate).instanceOf(Date);
    expect(aNewData.subCollection).toHaveLength(0);
    expect(aNewData.updatedAt).toBeUndefined();
    expect(aNewData.createdAt).toBeUndefined();
  });

  it("should use Timestamp", async () => {
    const aTestData = {
      aDate: aTimestamp,
      anArrayDates: [aTimestamp],
      anArrayObjDates: [{ aDate: aTimestamp }],
      aNested: {
        aDate: aTimestamp,
        aDoubleNested: {
          aDate: aTimestamp
        }
      }
    };

    const opt = {
      customId: true,
      addTimestamps: false,
      convertDocTimestampsToDate: false
    };

    const aNewData = formatData<TestDateFromFirestore, "USE_TIMESTAMPS">(
      _id,
      aTestData,
      opt,
      COLLECTION,
      []
    );

    expect(Object.keys(aNewData)).toHaveLength(5);
    expect(aNewData).toHaveProperty("id");
    expect(aNewData).toHaveProperty("data");
    expect(aNewData).toHaveProperty("subCollection");
    expect(aNewData).toHaveProperty("createdAt");
    expect(aNewData).toHaveProperty("updatedAt");
    expect(aNewData.id).toBe(_id);
    expect(aNewData.data.aDate).instanceOf(Timestamp);
    expect(aNewData.data.anArrayDates).instanceOf(Array<Timestamp>);
    expect(aNewData.data.anArrayObjDates).instanceOf(Array<{ aDate: Timestamp }>);
    expect(aNewData.data.aNested.aDate).instanceOf(Timestamp);
    expect(aNewData.data.aNested.aDoubleNested.aDate).instanceOf(Timestamp);
    expect(aNewData.subCollection).toHaveLength(0);
    expect(aNewData.updatedAt).toBeUndefined();
    expect(aNewData.createdAt).toBeUndefined();
  });
});
