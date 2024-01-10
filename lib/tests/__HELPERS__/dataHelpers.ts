import { CollectionOptions } from "@src/Firestore/Collection.js";
import { TestData } from "./typeHelpers.js";
import { Timestamp } from "firebase/firestore";
import { ID } from "@src/types.js";

export const TEST_DEFAULT_OPTIONS: CollectionOptions = {
  customId: false,
  addTimestamps: false
};

export const TEST_DATA_MOCK: TestData = {
  name: "mock",
  number: 10,
  date: Timestamp.now(),
  anArray: ["array"],
  anArrayObj: [{ num: 1 }],
  nest: {
    key: "value",
    key2: "value"
  }
};

export const TEST_ID_MOCK: ID = "fakerId";
