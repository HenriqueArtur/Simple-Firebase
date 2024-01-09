import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { formatQuery } from "@src/Firestore/Query.js";
import { SimpleQuery } from "@src/Firestore/QueryTypes.js";
import { FirebaseObject } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { TestData } from "@tests/__HELPERS__/typeHelpers.js";
import { Timestamp, and, collection, or, query, where } from "firebase/firestore";
import { describe, expect, it } from "vitest";

describe("Query", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aCollection = collection(FIRESTORE_WEB, "test");

  describe("ERRORS", () => {
    it('should be "where" empty', () => {
      const err = new SimpleFirebaseFirestoreError('"where" not be empty');
      const aQuery: SimpleQuery<TestData> = {
        where: {}
      };
      try {
        expect(formatQuery<TestData>(aCollection, aQuery)).toThrow();
      } catch (error: any) {
        expect(err.message).toBe(error.message);
      }
    });

    it('should be "where" with more than one Logical on root', () => {
      const err = new SimpleFirebaseFirestoreError(
        'When "where" start with "$OR" or "$AND" only accept one of this keys in root of "where".'
      );
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {},
          $OR: {}
        }
      };
      try {
        expect(formatQuery<TestData>(aCollection, aQuery)).toThrow();
      } catch (error: any) {
        expect(err.message).toBe(error.message);
      }
    });
  });

  describe("WITHOUT ATTRIBUTE OPERATORS", () => {
    it("should return a simple query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          name: "value"
        }
      };
      const response = query(aCollection, where("name", "==", "value"));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a simple query with $AND", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {
            name: "value"
          }
        }
      };
      const response = query(aCollection, and(where("name", "==", "value")));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a simple query with $OR", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $OR: {
            name: "value"
          }
        }
      };
      const response = query(aCollection, or(where("name", "==", "value")));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a query with $AND and $OR", () => {
      const date = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {
            name: "value",
            $OR: {
              date,
              name: "otherValue"
            }
          }
        }
      };
      const response = query(
        aCollection,
        and(
          where("name", "==", "value"),
          or(where("date", "==", date), where("name", "==", "otherValue"))
        )
      );
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a query with $AND inside $AND", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {
            $AND: {
              name: "otherValue"
            }
          }
        }
      };
      const response = query(aCollection, and(and(where("name", "==", "otherValue"))));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a query with $OR inside $OR", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $OR: {
            $OR: {
              name: "otherValue"
            }
          }
        }
      };
      const response = query(aCollection, or(or(where("name", "==", "otherValue"))));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a query with nested value", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          nest: {
            key: "value"
          }
        }
      };
      const response = query(aCollection, where("nest.key", "==", "value"));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });
  });
});
