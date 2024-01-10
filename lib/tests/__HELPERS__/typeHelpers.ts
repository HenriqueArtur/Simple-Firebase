import { Timestamp } from "firebase/firestore";

export interface TestData {
  name: string;
  number: number;
  date: Timestamp;
  anArray: string[];
  anArrayObj: [{ num: number }];
  nest: {
    key: string;
    key2: string;
  };
}

export interface SubColTestData {
  phone: string;
}
