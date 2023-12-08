import { expect, it } from "vitest";
import { helloWorld } from "@src/index.js";

it("should return Hello, World!", () => {
  expect(helloWorld()).toBe("Hello, World!");
});
