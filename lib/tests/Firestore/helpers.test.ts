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

    expect(
      formatData<TestData, "ADD_TIMESTAMP_DISABLE", "USE_DATE_ENABLE">(_id, aTestData, {
        useDate: true
      })
    ).toStrictEqual({
      _id,
      ...aResponseData
    });
  });
});
