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

export type QueryResult<T extends object, SC extends Record<string, object> = {}> = QueryResultData<
  T,
  SC
> &
  QueryResultFunctions<T, SC>;

export type QueryResultData<T extends object, SC extends Record<string, object> = {}> = {
  readonly docsFoundUntilNow: number;
  readonly page: number;
  readonly limit: number | "ALL";
  readonly isLastPage: boolean;
  readonly docs: SimpleDocument<T, SC>[];
};

export type QueryResultFunctions<T extends object, SC extends Record<string, object> = {}> = {
  nextPage(): Promise<QueryResult<T, SC>>;
};
