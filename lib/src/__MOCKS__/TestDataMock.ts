import { Deep } from "@src/types.js";
import { faker } from "@faker-js/faker";
import { TestData } from "@src/__HELPERS__/typeHelpers.js";
import { Timestamp } from "firebase/firestore";

export function TestDataMock(values?: Deep<TestData>): TestData {
  return {
    name: values?.name ?? faker.person.fullName(),
    number: values?.number ?? faker.number.int({ min: 0, max: 100 }),
    date: (values?.date as Timestamp) ?? Timestamp.now(),
    anArray: values?.anArray ?? [faker.person.jobArea()],
    anArrayObj: (values?.anArrayObj as TestData["anArrayObj"]) ?? [{ num: 10 }],
    nest: {
      key: values?.nest?.key ?? faker.person.firstName(),
      key2: values?.nest?.key2 ?? faker.person.zodiacSign()
    }
  };
}
