import { ID } from "@src/types.js";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import {
  DocFromFirestore,
  ModelFunctions,
  ModelOptions,
  OperationDoc,
  OptState,
  SimpleDocument
} from "./FirestoreTypes.js";
import { formatData } from "./helpers.js";
import { SimpleFirebaseFirestoreError } from "@src/Errors/SimpleFirebaseFirestoreError.js";

export interface Model<
  T extends object,
  A extends OptState<"ADD_TIMESTAMP"> = "ADD_TIMESTAMP_DISABLE",
  D extends OptState<"USE_DATE"> = "USE_DATE_ENABLE"
> extends ModelFunctions<T, A, D> {
  path: string;
  options?: ModelOptions<A>;
}

export function BuildModel<
  T extends Record<string, any>,
  A extends OptState<"ADD_TIMESTAMP">,
  D extends OptState<"USE_DATE">
>(aFirestoreRef: Firestore, path: string, options: ModelOptions<A>): Model<T, A, D> {
  const COLLECTION = collection(aFirestoreRef, path);

  return {
    path,
    options,
    create: async (aData: OperationDoc<SimpleDocument<T, A, D>>, customId?: ID) => {
      if (options.customId && !customId) {
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
        const aPreDocSnap = await getDoc(aDocRef);
        if (aPreDocSnap.exists()) {
          throw new SimpleFirebaseFirestoreError(`Document "${customId}" already exists.`);
        }
        await setDoc(aDocRef, aDataToCreate);
        const aDocSnap = await getDoc(aDocRef);
        return formatData(aDocSnap.id, aDocSnap.data() as DocFromFirestore<T, A, D>);
      }
      const aDocRef = await addDoc(COLLECTION, aDataToCreate);
      const aDocSnap = await getDoc(aDocRef);
      return formatData(aDocSnap.id, aDocSnap.data() as DocFromFirestore<T, A, D>);
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
