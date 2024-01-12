import { SimpleFirebaseFirestoreError } from "./SimpleFirebaseFirestoreError.js";

export class SimpleFirebaseFirestoreLastPageError extends SimpleFirebaseFirestoreError {
  constructor() {
    super("is last page.");
  }
}
