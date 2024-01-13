import { SimpleFirebaseFirestoreLastPageError } from "@src/Errors/SimpleFirebaseFirestoreLastPageError.js";
import { BuildFunctions } from "@src/Firestore/CollectionFunctions.js";
import { TEST_DEFAULT_OPTIONS } from "@tests/__HELPERS__/dataHelpers.js";
import { FirebaseObject, cleanCollections } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { TestData } from "@tests/__HELPERS__/typeHelpers.js";
import { TestDataMock } from "@tests/__MOCKS__/TestDataMock.js";
import { collection } from "firebase/firestore";
import { afterAll, describe, expect, it } from "vitest";

describe("Pagination", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aCollection = collection(FIRESTORE_WEB, "test");
  const FUNCTIONS = BuildFunctions<TestData>(aCollection, TEST_DEFAULT_OPTIONS);

  afterAll(async () => {
    await cleanCollections(FIRESTORE_WEB, [{ name: "test", subCollections: [{ name: "sub" }] }]);
  });

  describe("NextPage/7", () => {
    it("should find document on next page 1 paginate with limit 1", async () => {
      await Promise.all([
        FUNCTIONS.create(TestDataMock({ number: 4 })),
        FUNCTIONS.create(TestDataMock({ number: 420 })),
        FUNCTIONS.create(TestDataMock({ number: 450 })),
        FUNCTIONS.create(TestDataMock({ number: 495 }))
      ]);

      const aLastResponse = await FUNCTIONS.find({
        where: {
          number: {
            $GREATER: 410,
            $LESS: 490
          }
        },
        orderBy: {
          number: "ASC"
        },
        limit: 1
      });
      const response = await aLastResponse.nextPage();
      expect(response.docsFoundUntilNow).toBe(2);
      expect(response.page).toBe(1);
      expect(response.limit).toBe(1);
      expect(response.isLastPage).toBe(false);
      expect(response.docs).toHaveLength(1);
    });

    it("should the last page has arrived", async () => {
      await Promise.all([
        FUNCTIONS.create(TestDataMock({ number: 2 })),
        FUNCTIONS.create(TestDataMock({ number: 220 })),
        FUNCTIONS.create(TestDataMock({ number: 250 })),
        FUNCTIONS.create(TestDataMock({ number: 295 }))
      ]);

      const aMoreLastResponse = await FUNCTIONS.find({
        where: {
          number: {
            $GREATER: 210,
            $LESS: 290
          }
        },
        orderBy: {
          number: "ASC"
        },
        limit: 1
      });
      const aLastResponse = await aMoreLastResponse.nextPage();
      const response = await aLastResponse.nextPage();
      expect(response.docsFoundUntilNow).toBe(2);
      expect(response.page).toBe(2);
      expect(response.limit).toBe(1);
      expect(response.isLastPage).toBe(true);
      expect(response.docs).toHaveLength(0);
    });

    it("should throw error if last page arrive in last interaction", async () => {
      await Promise.all([
        FUNCTIONS.create(TestDataMock({ number: 3 })),
        FUNCTIONS.create(TestDataMock({ number: 320 })),
        FUNCTIONS.create(TestDataMock({ number: 350 })),
        FUNCTIONS.create(TestDataMock({ number: 395 }))
      ]);

      const aMoreMoreLastResponse = await FUNCTIONS.find({
        where: {
          number: {
            $GREATER: 310,
            $LESS: 390
          }
        },
        orderBy: {
          number: "ASC"
        },
        limit: 1
      });
      const aMoreLastResponse = await aMoreMoreLastResponse.nextPage();
      const aLastResponse = await aMoreLastResponse.nextPage();
      const error = new SimpleFirebaseFirestoreLastPageError();
      try {
        expect(await aLastResponse.nextPage()).toThrow(error);
      } catch (err: any) {
        expect(err).toHaveProperty("message");
        expect(err.message).toBe(error.message);
      }
    });
  });
});
