import { ID } from "@src/types.js";
import { Timestamp } from "firebase/firestore";

export type SimpleDocument<
  T extends object,
  A extends OptState<"ADD_TIMESTAMP">,
  D extends OptState<"USE_DATE">
> = T & { _id: ID } & UseDate<AddTimestamps<A>, D>;

type AddTimestamps<A extends OptState<"ADD_TIMESTAMP">> = A extends "ADD_TIMESTAMP_ENABLE"
  ? SimpleDocumentTimestamps
  : {};

type SimpleDocumentTimestamps = {
  _createdAt: Date;
  _updatedAt: Date;
};

type UseDate<T extends object, D extends OptState<"USE_DATE">> = D extends "USE_DATE_ENABLE"
  ? FirestoreDateDoc<T>
  : FirestoreDoc<T>;

export type OptState<T extends string> = `${Uppercase<T>}_ENABLE` | `${Uppercase<T>}_DISABLE`;

export type ModelOptions<A extends OptState<"ADD_TIMESTAMP">, D extends OptState<"USE_DATE">> = {
  customId?: boolean;
} & (A extends "ADD_TIMESTAMP_ENABLE" ? { addTimestamps: true } : { addTimestamps?: false }) &
  (D extends "USE_DATE_ENABLE" ? { useDate: true } : { useDate?: false });

export interface ModelFunctions<
  T extends object,
  A extends OptState<"ADD_TIMESTAMP">,
  D extends OptState<"USE_DATE">
> {
  create: (
    aData: OperationDoc<SimpleDocument<T, A, D>>,
    customId?: ID
  ) => Promise<SimpleDocument<T, A, D>>;
  delete: (anId: ID) => Promise<void>;
  find: () => Promise<SimpleDocument<T, A, D>[]>;
  findById: (anId: ID) => Promise<SimpleDocument<T, A, D> | undefined>;
  update: (anId: ID, newData: any) => Promise<SimpleDocument<T, A, D>>;
}

export type DocFromFirestore<
  T extends object,
  A extends OptState<"ADD_TIMESTAMP">,
  D extends OptState<"USE_DATE">
> = FirestoreDoc<Omit<SimpleDocument<T, A, D>, "_id">>;

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

export type OperationDoc<T> = Omit<T, "_id" | "_createdAt" | "_updatedAt">;
