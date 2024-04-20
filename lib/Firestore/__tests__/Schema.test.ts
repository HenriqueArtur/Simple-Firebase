import { describe, expect, it } from "vitest";
import { z } from "zod";

import { Schema } from "../Schema.js";

describe("Schema", () => {
  it("shoud instantiate Schema", () => {
    expect(Schema()).toStrictEqual(z)
  })
})
