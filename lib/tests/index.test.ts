import { expect, it } from "vitest";
import { helloWorld } from "../src";

it("should return Hello, World!", () => {
  expect(helloWorld()).toBe("Hello, World!");
});
