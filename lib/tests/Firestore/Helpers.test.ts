import {
  aOperator,
  flattenObject,
  formatAKey,
  formatDirection,
  isOperator
} from "@src/Firestore/Helpers.js";
import { describe, expect, it } from "vitest";

describe("Firestore Helpers", () => {
  describe("flattenObject/1", () => {
    it("should flatter object", () => {
      const input = {
        key1: "value1",
        key2: {
          key3: "value3",
          key4: {
            key5: "value5"
          }
        }
      };
      const output = {
        key1: "value1",
        "key2.key3": "value3",
        "key2.key4.key5": "value5"
      };
      expect(flattenObject(input)).toStrictEqual(output);
    });
  });

  describe("isOperator/1", () => {
    it("should return true if $LESS", () => {
      expect(isOperator("$LESS")).toBe(true);
    });

    it("should return true if $LESS_OR_EQ", () => {
      expect(isOperator("$LESS_OR_EQ")).toBe(true);
    });

    it("should return true if $EQ", () => {
      expect(isOperator("$EQ")).toBe(true);
    });

    it("should return true if $GREATER_OR_EQ", () => {
      expect(isOperator("$GREATER_OR_EQ")).toBe(true);
    });

    it("should return true if $GREATER", () => {
      expect(isOperator("$GREATER")).toBe(true);
    });

    it("should return true if $ARRAY_CONTAINS", () => {
      expect(isOperator("$ARRAY_CONTAINS")).toBe(true);
    });

    it("should return true if $ARRAY_CONTAINS_ANY", () => {
      expect(isOperator("$ARRAY_CONTAINS_ANY")).toBe(true);
    });

    it("should return true if $IN", () => {
      expect(isOperator("$IN")).toBe(true);
    });

    it("should return true if $NOT_IN", () => {
      expect(isOperator("$NOT_IN")).toBe(true);
    });

    it("should return true if $NOT", () => {
      expect(isOperator("$NOT")).toBe(true);
    });

    it("should return false if any else", () => {
      expect(isOperator("banana")).toBe(false);
    });
  });

  describe("aOperator/1", () => {
    it("should return WhereFilterOp from $LESS", () => {
      expect(aOperator("$LESS")).toBe("<");
    });

    it("should return WhereFilterOp from $LESS_OR_EQ", () => {
      expect(aOperator("$LESS_OR_EQ")).toBe("<=");
    });

    it("should return WhereFilterOp from $EQ", () => {
      expect(aOperator("$EQ")).toBe("==");
    });

    it("should return WhereFilterOp from $GREATER_OR_EQ", () => {
      expect(aOperator("$GREATER_OR_EQ")).toBe(">=");
    });

    it("should return WhereFilterOp from $GREATER", () => {
      expect(aOperator("$GREATER")).toBe(">");
    });

    it("should return WhereFilterOp from $ARRAY_CONTAINS", () => {
      expect(aOperator("$ARRAY_CONTAINS")).toBe("array-contains");
    });

    it("should return WhereFilterOp from $ARRAY_CONTAINS_ANY", () => {
      expect(aOperator("$ARRAY_CONTAINS_ANY")).toBe("array-contains-any");
    });

    it("should return WhereFilterOp from $IN", () => {
      expect(aOperator("$IN")).toBe("in");
    });

    it("should return WhereFilterOp from $NOT_IN", () => {
      expect(aOperator("$NOT_IN")).toBe("not-in");
    });

    it("should return WhereFilterOp from $NOT", () => {
      expect(aOperator("$NOT")).toBe("!=");
    });
  });

  describe("formatAKey/2", () => {
    it('should "lastKey" was empty', () => {
      expect(formatAKey("currentKey", "")).toBe("currentKey");
    });

    it('should "lastKey" NOT was empty', () => {
      expect(formatAKey("currentKey", "nest")).toBe("nest.currentKey");
    });
  });

  describe("formatDirection/2", () => {
    it('should return "asc"', () => {
      expect(formatDirection("ASC")).toBe("asc");
    });

    it('should return "desc"', () => {
      expect(formatDirection("DESC")).toBe("desc");
    });
  });
});
