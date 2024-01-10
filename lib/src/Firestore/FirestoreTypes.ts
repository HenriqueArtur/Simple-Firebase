import { Timestamp } from "firebase/firestore";
import { SimpleDocument } from "./SimpleDocument.js";

export type FirestoreDate<T> = {
  [K in keyof T]: T[K] extends Date
    ? Timestamp
    : T[K] extends (infer U)[]
    ? U extends Date
      ? Timestamp[]
      : FirestoreDate<U>[]
    : T[K] extends object
    ? FirestoreDate<T[K]>
    : T[K];
};

export type AddTimestamps<T extends object> = T & {
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
};

export type QueryResult<T extends object, SC extends Record<string, object> = {}> = {
  length: number;
  page: number;
  offset: number;
  docs: SimpleDocument<T, SC>[];
};
