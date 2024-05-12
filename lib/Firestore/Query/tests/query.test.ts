import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js"
import { BuildServicesTest } from "@src/tests-helpers/build-services.js"
import { and, collection, limit, or, orderBy, query, Timestamp, where } from "firebase/firestore"
import { describe, expect, it } from "vitest"

import { formatALimit, formatOrderBy, formatQuery, formatWhere } from "../query.js"
import { type OrderBy, type SimpleQuery, type Where } from "../QueryTypes.js"

describe("Query", async () => {
  const { FIRESTORE_WEB } = await BuildServicesTest()
  const a_collection = collection(FIRESTORE_WEB, "test")

  describe("COMPLEX QUERY", () => {
    it("should return WHERE, ORDER_BY and LIMIT", () => {
      const current_date = Timestamp.now()
      const a_query: SimpleQuery<object> = {
        where: {
          $AND: {
            nest: {
              key2: {
                $EQ: "value"
              }
            },
            date: {
              $GREATER: current_date,
              $LESS: current_date
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
      }
      const response = query(
        a_collection,
        and(
          where("nest.key2", "==", "value"),
          where("date", ">", current_date),
          where("date", "<", current_date),
          or(where("number", "==", 100), where("name", "!=", "value"))
        ),
        orderBy("name", "desc"),
        orderBy("nest.key2", "asc"),
        limit(100)
      )
      expect(formatQuery<object>(a_collection, a_query)).toStrictEqual(response)
    })
  })

  describe("ERRORS", () => {
    it('should be "where" empty', () => {
      const err = new SimpleFirebaseFirestoreError('"where" not be empty')
      const a_query: SimpleQuery<object> = {
        where: {}
      }
      try {
        expect(formatQuery<object>(a_collection, a_query)).toThrow()
      } catch (error: unknown) {
        expect(err.message).toBe((error as Error).message)
      }
    })

    it('should be "where" with more than one Logical on root', () => {
      const err = new SimpleFirebaseFirestoreError(
        'When "where" start with "$OR" or "$AND" only accept one of this keys in root of "where".'
      )
      const a_query: SimpleQuery<object> = {
        where: {
          $AND: {},
          $OR: {}
        }
      }
      try {
        expect(formatQuery<object>(a_collection, a_query)).toThrow()
      } catch (error: unknown) {
        expect(err.message).toBe((error as Error).message)
      }
    })
  })

  describe("formatWhere/2", () => {
    describe("WITHOUT ATTRIBUTE OPERATORS", () => {
      it("should return a simple query", () => {
        const a_query: Where<object> = {
          name: "value"
        }
        const response = [where("name", "==", "value")]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a simple query with $AND", () => {
        const a_query: Where<object> = {
          $AND: {
            name: "value"
          }
        }
        const response = [and(where("name", "==", "value"))]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a simple query with $OR", () => {
        const a_query: Where<object> = {
          $OR: {
            name: "value"
          }
        }
        const response = [or(where("name", "==", "value"))]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a query with $AND and $OR", () => {
        const date = Timestamp.now()
        const a_query: Where<object> = {
          $AND: {
            name: "value",
            $OR: {
              date,
              name: "otherValue"
            }
          }
        }
        const response = [
          and(
            where("name", "==", "value"),
            or(where("date", "==", date), where("name", "==", "otherValue"))
          )
        ]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a query with $AND inside $AND", () => {
        const a_query: Where<object> = {
          $AND: {
            $AND: {
              name: "otherValue"
            }
          }
        }
        const response = [and(and(where("name", "==", "otherValue")))]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a query with $OR inside $OR", () => {
        const a_query: Where<object> = {
          $OR: {
            $OR: {
              name: "otherValue"
            }
          }
        }
        const response = [or(or(where("name", "==", "otherValue")))]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a query with nested value", () => {
        const a_query: Where<object> = {
          nest: {
            key: "value"
          }
        }
        const response = [where("nest.key", "==", "value")]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })
    })

    describe("ATTRIBUTES", () => {
      it("should return a $NOT query", () => {
        const a_query: Where<object> = {
          nest: {
            key: { $NOT: "value" }
          }
        }
        const response = [where("nest.key", "!=", "value")]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a $IN query", () => {
        const a_query: Where<object> = {
          nest: {
            key: { $IN: ["value", "other_value"] }
          }
        }
        const response = [where("nest.key", "in", ["value", "other_value"])]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a $NOT_IN query", () => {
        const a_query: Where<object> = {
          nest: {
            key: { $NOT_IN: ["value", "other_value"] }
          }
        }
        const response = [where("nest.key", "not-in", ["value", "other_value"])]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $LESS query", () => {
        const a_query: Where<object> = {
          number: { $LESS: 100 }
        }
        const response = [where("number", "<", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $LESS_OR_EQ query", () => {
        const a_query: Where<object> = {
          number: { $LESS_OR_EQ: 100 }
        }
        const response = [where("number", "<=", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $EQ query", () => {
        const a_query: Where<object> = {
          number: { $EQ: 100 }
        }
        const response = [where("number", "==", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $GREATER_OR_EQ query", () => {
        const a_query: Where<object> = {
          number: { $GREATER_OR_EQ: 100 }
        }
        const response = [where("number", ">=", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $GREATER query", () => {
        const a_query: Where<object> = {
          number: { $GREATER: 100 }
        }
        const response = [where("number", ">", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a NUMBER $NOT query", () => {
        const a_query: Where<object> = {
          number: { $NOT: 100 }
        }
        const response = [where("number", "!=", 100)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $LESS query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $LESS: current_date }
        }
        const response = [where("date", "<", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $LESS_OR_EQ query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $LESS_OR_EQ: current_date }
        }
        const response = [where("date", "<=", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $EQ query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $EQ: current_date }
        }
        const response = [where("date", "==", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $GREATER_OR_EQ query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $GREATER_OR_EQ: current_date }
        }
        const response = [where("date", ">=", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $GREATER query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $GREATER: current_date }
        }
        const response = [where("date", ">", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a TIMESTAMP $NOT query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: { $NOT: current_date }
        }
        const response = [where("date", "!=", current_date)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a MULTIPLE attributes query", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          date: {
            $GREATER: current_date,
            $LESS: current_date
          },
          number: 100,
          name: {
            $NOT: "value"
          }
        }
        const response = [
          where("date", ">", current_date),
          where("date", "<", current_date),
          where("number", "==", 100),
          where("name", "!=", "value")
        ]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return a MULTIPLE attributes query with LOGICAL", () => {
        const current_date = Timestamp.now()
        const a_query: Where<object> = {
          $AND: {
            date: {
              $GREATER: current_date,
              $LESS: current_date
            },
            $OR: {
              number: 100,
              name: {
                $NOT: "value"
              }
            }
          }
        }
        const response = [
          and(
            where("date", ">", current_date),
            where("date", "<", current_date),
            or(where("number", "==", 100), where("name", "!=", "value"))
          )
        ]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return an $ARRAY_CONTAINS_ANY query", () => {
        const value = ["value", "otherValue"]
        const a_query: Where<object> = {
          anArray: value
        }
        const response = [where("anArray", "array-contains-any", value)]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })

      it("should return an $ARRAY_CONTAINS query", () => {
        const a_query: Where<object> = {
          anArray: { $ARRAY_CONTAINS: "value" }
        }
        const response = [where("anArray", "array-contains", "value")]
        expect(formatWhere(a_query)).toStrictEqual(response)
      })
    })
  })

  describe("formatOrderBy/2", () => {
    it("should return empty array", () => {
      const an_order: OrderBy<object> = {}
      const response: unknown[] = []
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })

    it('should order name "ASC"', () => {
      const an_order: OrderBy<object> = {
        name: "ASC"
      }
      const response = [orderBy("name", "asc")]
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })

    it('should order name "DESC"', () => {
      const an_order: OrderBy<object> = {
        name: "DESC"
      }
      const response = [orderBy("name", "desc")]
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })

    it('should order nest.key "ASC"', () => {
      const an_order: OrderBy<object> = {
        nest: { key: "ASC" }
      }
      const response = [orderBy("nest.key", "asc")]
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })

    it('should order nest.key "DESC"', () => {
      const an_order: OrderBy<object> = {
        nest: { key: "DESC" }
      }
      const response = [orderBy("nest.key", "desc")]
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })

    it("should MULTIPLE orders", () => {
      const an_order: OrderBy<object> = {
        name: "DESC",
        nest: { key: "ASC" }
      }
      const response = [orderBy("name", "desc"), orderBy("nest.key", "asc")]
      expect(formatOrderBy(an_order)).toStrictEqual(response)
    })
  })

  describe("formatALimit/1", () => {
    it("should return empty limit", () => {
      expect(formatALimit()).toStrictEqual([])
    })

    it("should return a filled limit", () => {
      expect(formatALimit(100)).toStrictEqual([limit(100)])
    })
  })
})
