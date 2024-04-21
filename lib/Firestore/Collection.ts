import { type Firestore } from "firebase/firestore"

import { type SchemaType } from "./Schema/index.js"

export function Collection(
  a_firestore_ref: Firestore,
  a_path: string,
  a_schema: SchemaType,
) {
  console.debug(a_schema)
  console.debug(a_path)
  console.debug(a_firestore_ref)
}

// export function SubCollection<T extends object, SC extends Record<string, object> = {}>(
//   aParentCollection: CollectionReference,
//   aParentId: ID,
//   aPath: string,
//   anOptions: CollectionOptions
// ) {
//   return BuildFunctions<T, SC>(collection(aParentCollection, aParentId, aPath), anOptions);
// }
//
// /* HANDLERS */
// export function setOptions(anOptions?: Deep<CollectionOptions>): CollectionOptions {
//   if (!anOptions) {
//     return {
//       customId: false,
//       addTimestamps: true,
//     }
//   }
//   return {
//     customId: "customId" in anOptions ? (anOptions.customId!) : false,
//     addTimestamps: "addTimestamps" in anOptions ? (anOptions.addTimestamps!) : true
//   };
// };
