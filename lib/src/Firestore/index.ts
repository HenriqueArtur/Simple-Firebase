import { Firestore } from "firebase/firestore";
import { BuildCollection } from "./Collection.js";
import { ModelOptions, OptState } from "./FirestoreTypes.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    collection: <
      T extends object,
      A extends OptState<"ADD_TIMESTAMP"> = "ADD_TIMESTAMP_DISABLE",
      D extends OptState<"USE_DATE"> = "USE_DATE_ENABLE"
    >(
      modelName: string,
      options: ModelOptions<A, D>
    ) => {
      return BuildCollection<T, A, D>(aFirestoreRef, modelName, options);
    },
    collectionWithSchema: (_modelName: string, _schema: any, _options = {}) => {
      throw new Error("Not implemented!");
    }
  };
}
