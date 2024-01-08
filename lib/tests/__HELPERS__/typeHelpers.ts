import { Timestamp } from "firebase/firestore";

export interface TestData {
  name: string;
  date: Timestamp;
  anArray: [{ num: number }];
}

export interface SubColTestData {
  phone: string;
}
