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

  describe("ATTRIBUTES", () => {
    it("should return a $NOT query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          nest: {
            key: { $NOT: "value" }
          }
        }
      };
      const response = query(aCollection, where("nest.key", "!=", "value"));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a $IN query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          nest: {
            key: { $IN: ["value", "other_value"] }
          }
        }
      };
      const response = query(aCollection, where("nest.key", "in", ["value", "other_value"]));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a $NOT_IN query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          nest: {
            key: { $NOT_IN: ["value", "other_value"] }
          }
        }
      };
      const response = query(aCollection, where("nest.key", "not-in", ["value", "other_value"]));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $LESS query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $LESS: 100 }
        }
      };
      const response = query(aCollection, where("number", "<", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $LESS_OR_EQ query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $LESS_OR_EQ: 100 }
        }
      };
      const response = query(aCollection, where("number", "<=", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $EQ query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $EQ: 100 }
        }
      };
      const response = query(aCollection, where("number", "==", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $GREATER_OR_EQ query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $GREATER_OR_EQ: 100 }
        }
      };
      const response = query(aCollection, where("number", ">=", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $GREATER query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $GREATER: 100 }
        }
      };
      const response = query(aCollection, where("number", ">", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a NUMBER $NOT query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          number: { $NOT: 100 }
        }
      };
      const response = query(aCollection, where("number", "!=", 100));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $LESS query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $LESS: currentDate }
        }
      };
      const response = query(aCollection, where("date", "<", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $LESS_OR_EQ query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $LESS_OR_EQ: currentDate }
        }
      };
      const response = query(aCollection, where("date", "<=", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $EQ query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $EQ: currentDate }
        }
      };
      const response = query(aCollection, where("date", "==", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $GREATER_OR_EQ query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $GREATER_OR_EQ: currentDate }
        }
      };
      const response = query(aCollection, where("date", ">=", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $GREATER query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $GREATER: currentDate }
        }
      };
      const response = query(aCollection, where("date", ">", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a TIMESTAMP $NOT query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: { $NOT: currentDate }
        }
      };
      const response = query(aCollection, where("date", "!=", currentDate));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a MULTIPLE attributes query", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          date: {
            $GREATER: currentDate,
            $LESS: currentDate
          },
          number: 100,
          name: {
            $NOT: "value"
          }
        }
      };
      const response = query(
        aCollection,
        where("date", ">", currentDate),
        where("date", "<", currentDate),
        where("number", "==", 100),
        where("name", "!=", "value")
      );
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return a MULTIPLE attributes query with LOGICAL", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {
            date: {
              $GREATER: currentDate,
              $LESS: currentDate
            },
            $OR: {
              number: 100,
              name: {
                $NOT: "value"
              }
            }
          }
        }
      };
      const response = query(
        aCollection,
        and(
          where("date", ">", currentDate),
          where("date", "<", currentDate),
          or(where("number", "==", 100), where("name", "!=", "value"))
        )
      );
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return an $ARRAY_CONTAINS_ANY query", () => {
      const value = ["value", "otherValue"];
      const aQuery: SimpleQuery<TestData> = {
        where: {
          anArray: value
        }
      };
      const response = query(aCollection, where("anArray", "array-contains-any", value));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });

    it("should return an $ARRAY_CONTAINS query", () => {
      const aQuery: SimpleQuery<TestData> = {
        where: {
          anArray: { $ARRAY_CONTAINS: "value" }
        }
      };
      const response = query(aCollection, where("anArray", "array-contains", "value"));
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });
  });
});
