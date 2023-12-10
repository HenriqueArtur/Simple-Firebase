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
import { DocFormat, ModelFunctions, ModelOptions, OptState } from "./FirestoreTypes.js";
import { formatData } from "./helpers.js";

export interface Model<T extends object, AddTimestamps extends OptState<"TIMESTAMP">>
  extends ModelFunctions<T, AddTimestamps> {
  path: string;
  options?: ModelOptions;
}

export function BuildModel<T extends object, AddTimestamps extends OptState<"TIMESTAMP">>(
  aFirestoreRef: Firestore,
  path: string,
  options?: ModelOptions
): Model<T, AddTimestamps> {
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
        return formatData(
          aDocSnap.id,
          aDocSnap.data() as DocFormat<T, AddTimestamps>,
          options?.addTimestamps
        );
      }
      const aDocRef = await addDoc(COLLECTION, aDataToCreate);
      const aDocSnap = await getDoc(aDocRef);
      return formatData(
        aDocSnap.id,
        aDocSnap.data() as DocFormat<T, AddTimestamps>,
        options?.addTimestamps
      );
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
