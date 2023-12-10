import { Firestore } from "firebase/firestore";
import { BuildModel } from "./Model.js";
import { ModelOptions, OptState } from "./FirestoreTypes.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    model: <T extends object, AddTimestamps extends OptState<"TIMESTAMP"> = "TIMESTAMP_DISABLE">(
      modelName: string,
      options: ModelOptions = {}
    ) => {
      return BuildModel<T, AddTimestamps>(aFirestoreRef, modelName, options);
    },
    modelWithSchema: (_modelName: string, _schema: any, _options: ModelOptions = {}) => {
      throw new Error("Not implemented!");
    }
  };
}
