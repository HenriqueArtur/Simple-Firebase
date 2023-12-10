import { Firestore } from "firebase/firestore";
import { BuildModel } from "./Model.js";
import { ModelOptions, OptState } from "./FirestoreTypes.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    model: <
      T extends object,
      A extends OptState<"ADD_TIMESTAMP"> = "ADD_TIMESTAMP_DISABLE",
      D extends OptState<"USE_DATE"> = "USE_DATE_ENABLE"
    >(
      modelName: string,
      options: ModelOptions<A, D>
    ) => {
      return BuildModel<T, A, D>(aFirestoreRef, modelName, options);
    },
    modelWithSchema: (_modelName: string, _schema: any, _options = {}) => {
      throw new Error("Not implemented!");
    }
  };
}
