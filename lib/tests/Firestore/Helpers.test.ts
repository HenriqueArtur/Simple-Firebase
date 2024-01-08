import { flattenObject } from "@src/Firestore/Helpers.js";
import { describe, expect, it } from "vitest";

describe("Firestore Helpers", () => {
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
