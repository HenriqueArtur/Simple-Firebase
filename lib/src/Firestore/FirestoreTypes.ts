import { Timestamp } from "firebase/firestore";

export type DateFormat = "USE_TIMESTAMPS" | "USE_DATE";

export type FirestoreDoc<T> = {
  [K in keyof T]: T[K] extends Date
    ? Timestamp
    : T[K] extends (infer U)[]
    ? U extends Date
      ? Timestamp[]
      : FirestoreDoc<U>[]
    : T[K] extends object
    ? FirestoreDoc<T[K]>
    : T[K];
};

export type FirestoreDateDoc<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? Date
    : T[K] extends (infer U)[]
    ? U extends Timestamp
      ? Date[]
      : FirestoreDateDoc<U>[]
    : T[K] extends object
    ? FirestoreDateDoc<T[K]>
    : T[K];
};

export type AddTimestamps<T extends object> = T & {
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
};
