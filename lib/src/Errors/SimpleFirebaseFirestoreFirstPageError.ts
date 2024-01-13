import { SimpleFirebaseFirestoreError } from "./SimpleFirebaseFirestoreError.js";

export class SimpleFirebaseFirestoreFirstPageError extends SimpleFirebaseFirestoreError {
  constructor() {
    super("is first page.");
  }
}
