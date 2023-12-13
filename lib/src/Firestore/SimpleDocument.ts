import { ID } from "@src/types.js";
import { Timestamp } from "firebase/firestore/lite";
import { DateFormat, FirestoreDoc } from "./FirestoreTypes.js";
import { Collection } from "./Collection.js";

export interface SimpleDocument<T extends object, D extends DateFormat> {
  id: ID;
  data: D extends "USE_DATE" ? T : FirestoreDoc<T>;
  subCollection: Collection<object, D>[];
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
}
