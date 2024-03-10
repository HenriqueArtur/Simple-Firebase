import { Firestore } from "firebase/firestore";
import { FirestoreObject } from "./firestoreTestsHelpers.js";
import { SubColTestData, TestData } from "./typeHelpers.js";
import { TEST_DATA_MOCK } from "./dataHelpers.js";

const TestDataModel = (aFirestoreRef: Firestore) =>
  FirestoreObject(aFirestoreRef).collection<TestData, { sub: SubColTestData }>("test");

export const registerTestData = async (aFirestoreRef: Firestore) =>
  await TestDataModel(aFirestoreRef).create(TEST_DATA_MOCK);
