import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";
import { formatALimit, formatOrderBy, formatQuery, formatWhere } from "@src/Firestore/Query.js";
import { OrderBy, SimpleQuery, Where } from "@src/Firestore/QueryTypes.js";
import { FirebaseObject } from "@tests/__HELPERS__/firestoreTestsHelpers.js";
import { TestData } from "@tests/__HELPERS__/typeHelpers.js";
import { Timestamp, and, collection, limit, or, orderBy, query, where } from "firebase/firestore";
import { describe, expect, it } from "vitest";

describe("Query", async () => {
  const { FIRESTORE_WEB } = await FirebaseObject();
  const aCollection = collection(FIRESTORE_WEB, "test");

  describe("COMPLEX QUERY", () => {
    it("should return WHERE, ORDER_BY and LIMIT", () => {
      const currentDate = Timestamp.now();
      const aQuery: SimpleQuery<TestData> = {
        where: {
          $AND: {
            nest: {
              key2: {
                $EQ: "value"
              }
            },
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
        },
        orderBy: {
          name: "DESC",
          nest: {
            key2: "ASC"
          }
        },
        limit: 100
      };
      const response = query(
        aCollection,
        and(
          where("nest.key2", "==", "value"),
          where("date", ">", currentDate),
          where("date", "<", currentDate),
          or(where("number", "==", 100), where("name", "!=", "value"))
        ),
        orderBy("name", "desc"),
        orderBy("nest.key2", "asc"),
        limit(100)
      );
      expect(formatQuery<TestData>(aCollection, aQuery)).toStrictEqual(response);
    });
  });

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

  describe("formatWhere/2", () => {
    describe("WITHOUT ATTRIBUTE OPERATORS", () => {
      it("should return a simple query", () => {
        const aQuery: Where<TestData> = {
          name: "value"
        };
        const response = [where("name", "==", "value")];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a simple query with $AND", () => {
        const aQuery: Where<TestData> = {
          $AND: {
            name: "value"
          }
        };
        const response = [and(where("name", "==", "value"))];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a simple query with $OR", () => {
        const aQuery: Where<TestData> = {
          $OR: {
            name: "value"
          }
        };
        const response = [or(where("name", "==", "value"))];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a query with $AND and $OR", () => {
        const date = Timestamp.now();
        const aQuery: Where<TestData> = {
          $AND: {
            name: "value",
            $OR: {
              date,
              name: "otherValue"
            }
          }
        };
        const response = [
          and(
            where("name", "==", "value"),
            or(where("date", "==", date), where("name", "==", "otherValue"))
          )
        ];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a query with $AND inside $AND", () => {
        const aQuery: Where<TestData> = {
          $AND: {
            $AND: {
              name: "otherValue"
            }
          }
        };
        const response = [and(and(where("name", "==", "otherValue")))];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a query with $OR inside $OR", () => {
        const aQuery: Where<TestData> = {
          $OR: {
            $OR: {
              name: "otherValue"
            }
          }
        };
        const response = [or(or(where("name", "==", "otherValue")))];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a query with nested value", () => {
        const aQuery: Where<TestData> = {
          nest: {
            key: "value"
          }
        };
        const response = [where("nest.key", "==", "value")];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });
    });

    describe("ATTRIBUTES", () => {
      it("should return a $NOT query", () => {
        const aQuery: Where<TestData> = {
          nest: {
            key: { $NOT: "value" }
          }
        };
        const response = [where("nest.key", "!=", "value")];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a $IN query", () => {
        const aQuery: Where<TestData> = {
          nest: {
            key: { $IN: ["value", "other_value"] }
          }
        };
        const response = [where("nest.key", "in", ["value", "other_value"])];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a $NOT_IN query", () => {
        const aQuery: Where<TestData> = {
          nest: {
            key: { $NOT_IN: ["value", "other_value"] }
          }
        };
        const response = [where("nest.key", "not-in", ["value", "other_value"])];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $LESS query", () => {
        const aQuery: Where<TestData> = {
          number: { $LESS: 100 }
        };
        const response = [where("number", "<", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $LESS_OR_EQ query", () => {
        const aQuery: Where<TestData> = {
          number: { $LESS_OR_EQ: 100 }
        };
        const response = [where("number", "<=", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $EQ query", () => {
        const aQuery: Where<TestData> = {
          number: { $EQ: 100 }
        };
        const response = [where("number", "==", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $GREATER_OR_EQ query", () => {
        const aQuery: Where<TestData> = {
          number: { $GREATER_OR_EQ: 100 }
        };
        const response = [where("number", ">=", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $GREATER query", () => {
        const aQuery: Where<TestData> = {
          number: { $GREATER: 100 }
        };
        const response = [where("number", ">", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a NUMBER $NOT query", () => {
        const aQuery: Where<TestData> = {
          number: { $NOT: 100 }
        };
        const response = [where("number", "!=", 100)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $LESS query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $LESS: currentDate }
        };
        const response = [where("date", "<", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $LESS_OR_EQ query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $LESS_OR_EQ: currentDate }
        };
        const response = [where("date", "<=", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $EQ query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $EQ: currentDate }
        };
        const response = [where("date", "==", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $GREATER_OR_EQ query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $GREATER_OR_EQ: currentDate }
        };
        const response = [where("date", ">=", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $GREATER query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $GREATER: currentDate }
        };
        const response = [where("date", ">", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a TIMESTAMP $NOT query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: { $NOT: currentDate }
        };
        const response = [where("date", "!=", currentDate)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a MULTIPLE attributes query", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
          date: {
            $GREATER: currentDate,
            $LESS: currentDate
          },
          number: 100,
          name: {
            $NOT: "value"
          }
        };
        const response = [
          where("date", ">", currentDate),
          where("date", "<", currentDate),
          where("number", "==", 100),
          where("name", "!=", "value")
        ];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return a MULTIPLE attributes query with LOGICAL", () => {
        const currentDate = Timestamp.now();
        const aQuery: Where<TestData> = {
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
        };
        const response = [
          and(
            where("date", ">", currentDate),
            where("date", "<", currentDate),
            or(where("number", "==", 100), where("name", "!=", "value"))
          )
        ];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return an $ARRAY_CONTAINS_ANY query", () => {
        const value = ["value", "otherValue"];
        const aQuery: Where<TestData> = {
          anArray: value
        };
        const response = [where("anArray", "array-contains-any", value)];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });

      it("should return an $ARRAY_CONTAINS query", () => {
        const aQuery: Where<TestData> = {
          anArray: { $ARRAY_CONTAINS: "value" }
        };
        const response = [where("anArray", "array-contains", "value")];
        expect(formatWhere(aQuery)).toStrictEqual(response);
      });
    });
  });

  describe("formatOrderBy/2", () => {
    it("should return empty array", () => {
      const anOrder: OrderBy<TestData> = {};
      const response: any[] = [];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });

    it('should order name "ASC"', () => {
      const anOrder: OrderBy<TestData> = {
        name: "ASC"
      };
      const response = [orderBy("name", "asc")];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });

    it('should order name "DESC"', () => {
      const anOrder: OrderBy<TestData> = {
        name: "DESC"
      };
      const response = [orderBy("name", "desc")];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });

    it('should order nest.key "ASC"', () => {
      const anOrder: OrderBy<TestData> = {
        nest: { key: "ASC" }
      };
      const response = [orderBy("nest.key", "asc")];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });

    it('should order nest.key "DESC"', () => {
      const anOrder: OrderBy<TestData> = {
        nest: { key: "DESC" }
      };
      const response = [orderBy("nest.key", "desc")];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });

    it("should MULTIPLE orders", () => {
      const anOrder: OrderBy<TestData> = {
        name: "DESC",
        nest: { key: "ASC" }
      };
      const response = [orderBy("name", "desc"), orderBy("nest.key", "asc")];
      expect(formatOrderBy(anOrder)).toStrictEqual(response);
    });
  });

  describe("formatALimit/1", () => {
    it("should return empty limit", () => {
      expect(formatALimit()).toStrictEqual([]);
    });

    it("should return a filled limit", () => {
      expect(formatALimit(100)).toStrictEqual([limit(100)]);
    });
  });
});
