import {
  CollectionReference,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  getDocs,
  query,
  startAfter
} from "firebase/firestore";
import { AddTimestamps, QueryResult } from "./FirestoreTypes.js";
import { SimpleFirebaseFirestoreLastPageError } from "@src/Errors/SimpleFirebaseFirestoreLastPageError.js";
import { formatSimpleDocument } from "./SimpleDocument.js";
import { CollectionOptions } from "./Collection.js";

export async function NextPage<T extends object, SC extends Record<string, object> = {}>(
  aLastQuery: Query,
  aLastDocsFoundUntilNow: number,
  aLastPage: number,
  aLimit: number | "ALL",
  aCursor: QueryDocumentSnapshot | undefined,
  aCollection: CollectionReference,
  anOptions: CollectionOptions
): Promise<QueryResult<T, SC>> {
  if (aLimit == "ALL" || !aCursor) {
    throw new SimpleFirebaseFirestoreLastPageError();
  }
  const aQuery = query(aLastQuery, startAfter(aCursor));
  const docsList = await getDocs(aQuery);
  const aNewCursor = defineACursor(docsList);
  const docsFoundUntilNow = aLastDocsFoundUntilNow + docsList.docs.length;
  const page = aLastPage + 1;
  const result: QueryResult<T, SC> = {
    docsFoundUntilNow,
    page,
    limit: aLimit,
    isLastPage: docsList.docs.length < aLimit,
    docs: docsList.docs.map((d) =>
      formatSimpleDocument<T, SC>(d.id, d.data() as AddTimestamps<T>, anOptions, aCollection)
    ),
    nextPage: () =>
      NextPage(aLastQuery, docsFoundUntilNow, page, aLimit, aNewCursor, aCollection, anOptions)
  };
  return result;
}

export const defineACursor = (aDocList: QuerySnapshot) =>
  aDocList.size != 0 ? aDocList.docs[aDocList.size - 1] : undefined;
