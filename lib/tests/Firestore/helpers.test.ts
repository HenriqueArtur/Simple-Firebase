import { FirestoreDoc } from "@src/Firestore/FirestoreTypes.js";
import { formatData } from "@src/Firestore/helpers.js";
import { ID } from "@src/types.js";
import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";

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

  it("should format date recursively", async () => {
    const _id: ID = "id";
    const aTimestamp: Timestamp = Timestamp.now();
    const aDate: Date = aTimestamp.toDate();

    const aTestData: FirestoreDoc<TestData> = {
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

    const aResponseData: TestData = {
      aDate: aDate,
      anArrayDates: [aDate],
      anArrayObjDates: [{ aDate: aDate }],
      aNested: {
        aDate: aDate,
        aDoubleNested: {
          aDate: aDate
        }
      }
    };

    expect(formatData<TestData, "TIMESTAMP_DISABLE">(_id, aTestData)).toStrictEqual({
      _id,
      ...aResponseData
    });
  });
});
