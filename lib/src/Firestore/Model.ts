import { ID } from "@src/types.js";
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import {
  DocFormat,
  DocFormatFirestore,
  ModelFunctions,
  ModelOptions,
  OptState
} from "./FirestoreTypes.js";
import { formatData } from "./helpers.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";

export interface Model<T extends object, AddTimestamps extends OptState<"TIMESTAMP">>
  extends ModelFunctions<T, AddTimestamps> {
  path: string;
  options?: ModelOptions;
}

export function BuildModel<T extends object, AddTimestamps extends OptState<"TIMESTAMP">>(
  aFirestoreRef: Firestore,
  path: string,
  options: ModelOptions = {}
): Model<T, AddTimestamps> {
  const COLLECTION = collection(aFirestoreRef, path) as CollectionReference<
    DocFormat<T, AddTimestamps>
  >;

  return {
    path,
    options,
    create: async (aData: T, customId?: ID) => {
      if (options?.customId && !customId) {
        throw new SimpleFirebaseFirestoreError(
          '"customId" is needed if option "customId" was enabled.'
        );
      }
      if (
        (!("customId" in options) && customId) ||
        ("customId" in options && options.customId == false && customId)
      ) {
        throw new SimpleFirebaseFirestoreError(
          '"customId" is not needed if option "customId" was disabled.'
        );
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
        return formatData(aDocSnap.id, aDocSnap.data() as DocFormatFirestore<T, AddTimestamps>);
      }
      const aDocRef = await addDoc(COLLECTION, aDataToCreate);
      const aDocSnap = await getDoc(aDocRef);
      return formatData(aDocSnap.id, aDocSnap.data() as DocFormatFirestore<T, AddTimestamps>);
    },
    delete: async (_anId: ID) => {
      throw new Error("Not Implemented!");
    },
    find: async () => {
      throw new Error("Not Implemented!");
    },
    findById: async (_anId: ID) => {
      throw new Error("Not Implemented!");
    },
    update: async (_anId: ID, _newData: any) => {
      throw new Error("Not Implemented!");
    }
  };
}
