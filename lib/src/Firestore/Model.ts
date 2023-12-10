import { ID } from "@src/types.js";
import {
  CollectionReference,
  Firestore,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

export interface Model<T extends object, AddTimestamps extends OptState<"TIMESTAMP">>
  extends ModelFunction<T, AddTimestamps> {
  path: string;
  options?: ModelOptions;
}

type OptState<T extends string> = `${Uppercase<T>}_ENABLE` | `${Uppercase<T>}_DISABLE`;

export interface ModelOptions {
  customId?: boolean;
  addTimestamps?: boolean;
}

export interface ModelFunction<T extends object, AddTimestamps extends OptState<"TIMESTAMP">> {
  create: (aData: T, customId?: ID) => Promise<Document<T, AddTimestamps>>;
  delete: (anId: ID) => Promise<void>;
  find: () => Promise<Document<T, AddTimestamps>[]>;
  findById: (anId: ID) => Promise<Document<T, AddTimestamps> | undefined>;
  update: (anId: ID, newData: any) => Promise<Document<T, AddTimestamps>>;
}

export type Document<
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

type FirestoreDoc<T> = {
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

export function BuildModel<
  T extends object,
  AddTimestamps extends OptState<"TIMESTAMP"> = "TIMESTAMP_DISABLE"
>(aFirestoreRef: Firestore, path: string, options?: ModelOptions): Model<T, AddTimestamps> {
  const COLLECTION = collection(aFirestoreRef, path) as CollectionReference<
    DocFormat<T, AddTimestamps>
  >;

  return {
    path,
    options,
    create: async (aData: T, customId?: ID) => {
      if (options?.customId && !customId) {
        throw new Error('"customId" is needed if option "customId" was enabled.');
      }
      if ((!options && customId) || (options?.customId == false && customId)) {
        throw new Error('"customId" is not needed if option "customId" was disabled.');
      }
      const aDataToCreate = options?.addTimestamps
        ? {
            ...aData,
            _createdAt: serverTimestamp(),
            _updatedAt: serverTimestamp()
          }
        : aData;

      if (customId) {
        const aDocRef = doc(COLLECTION, customId);
        await setDoc(aDocRef, aDataToCreate);
        const aDocSnap = await getDoc(aDocRef);
        return formatData(aDocSnap.id, aDocSnap.data() as DocFormat<T, AddTimestamps>);
      }
      const aDocRef = await addDoc(COLLECTION, aDataToCreate);
      const aDocSnap = await getDoc(aDocRef);
      return formatData(aDocSnap.id, aDocSnap.data() as DocFormat<T, AddTimestamps>);
    },
    delete: async (anId: ID) => {
      throw new Error("Not Implemented!");
    },
    find: async () => {
      throw new Error("Not Implemented!");
    },
    findById: async (anId: ID) => {
      throw new Error("Not Implemented!");
    },
    update: async (anId: ID, newData: any) => {
      throw new Error("Not Implemented!");
    }
  };

  function formatData(anId: ID, aData: DocFormat<T, AddTimestamps>) {
    if (options?.addTimestamps) {
      const aDataWithTimestamp = aData as FirestoreDoc<T> & TimestampsData;
      return {
        _id: anId,
        ...aDataWithTimestamp,
        _createdAt: aDataWithTimestamp._createdAt.toDate(),
        _updatedAt: aDataWithTimestamp._updatedAt.toDate()
      } as Document<T, AddTimestamps>;
    }
    const aDataWithoutTimestamp = aData as FirestoreDoc<T>;
    return {
      _id: anId,
      ...aDataWithoutTimestamp
    } as Document<T, AddTimestamps>;
  }
}
