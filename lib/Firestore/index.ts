import { type Deep } from "@src/types.js";
import { type Firestore } from "firebase/firestore";

import { Collection, type CollectionOptions, setOptions } from "./Collection.js";

export function BuildFirestore(a_firestore_ref: Firestore) {
  return {
    collection: <T extends object, SC extends Record<string, object>>(
      a_collection_name: string,
      an_options?: Deep<CollectionOptions>
    ) => {
      const an_options_filled = setOptions(an_options)
      return Collection<T, SC>(a_firestore_ref, a_collection_name, an_options_filled);
    }
  };
}
