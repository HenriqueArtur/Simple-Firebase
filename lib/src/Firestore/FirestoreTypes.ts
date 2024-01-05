import { Timestamp } from "firebase/firestore";

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
