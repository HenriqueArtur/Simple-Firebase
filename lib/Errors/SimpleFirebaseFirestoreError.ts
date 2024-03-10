import { SimpleFirebaseError } from "./SimpleFirebaseError.js";

export class SimpleFirebaseFirestoreError extends SimpleFirebaseError {
  constructor(msg: string) {
    super(msg, "FIRESTORE");
  }
}
