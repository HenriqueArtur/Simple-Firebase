import { Firestore } from "firebase/firestore";
import { BuildModel, ModelOptions } from "./Model.js";

export function BuildFirestore(aFirestoreRef: Firestore) {
  return {
    model: <T extends object>(modelName: string, options: ModelOptions = {}) => {
      return BuildModel<T>(aFirestoreRef, modelName, options);
    }
  };
}