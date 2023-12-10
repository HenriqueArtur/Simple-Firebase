import { ID } from "@src/types.js";
import { Timestamp } from "firebase/firestore";

export type OptState<T extends string> = `${Uppercase<T>}_ENABLE` | `${Uppercase<T>}_DISABLE`;

export interface ModelOptions {
  customId?: boolean;
  addTimestamps?: boolean;
}

export interface ModelFunctions<T extends object, AddTimestamps extends OptState<"TIMESTAMP">> {
  create: (aData: T, customId?: ID) => Promise<DBDocument<T, AddTimestamps>>;
  delete: (anId: ID) => Promise<void>;
  find: () => Promise<DBDocument<T, AddTimestamps>[]>;
  findById: (anId: ID) => Promise<DBDocument<T, AddTimestamps> | undefined>;
  update: (anId: ID, newData: any) => Promise<DBDocument<T, AddTimestamps>>;
}

export type DBDocument<
  T extends object,
  AddTimestamps extends OptState<"TIMESTAMP">
> = AddTimestamps extends "TIMESTAMP_DISABLE" ? DocumentData<T> : DocumentDataTimestamp<T>;
export type DocumentData<T extends object> = T & { readonly _id: ID };
export type DocumentDataTimestamp<T extends object> = T & {
  readonly _id: ID;
  readonly _createdAt: Date;
  readonly _updatedAt: Date;
};

export interface TimestampsData {
  _createdAt: Timestamp;
  _updatedAt: Timestamp;
}

export type DocFormat<
  T extends object,
  O extends OptState<"TIMESTAMP">
> = O extends "TIMESTAMP_DISABLE" ? T : T & TimestampsData;

export type FirestoreDoc<T> = {
  [K in keyof T]: T[K] extends Date
    ? Timestamp
    : T[K] extends (infer U)[]
    ? FirestoreDoc<U>[]
    : T[K] extends object
    ? FirestoreDoc<T[K]>
    : T[K];
};

export type DocumentDataFirestore<T extends object> = Omit<FirestoreDoc<DocumentData<T>>, "_id">;
export type DocumentDataTimestampFirestore<T extends object> = Omit<
  FirestoreDoc<DocumentDataTimestamp<T>>,
  "_id"
>;
