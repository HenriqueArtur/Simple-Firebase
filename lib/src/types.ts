export type ID = string;
export type Email = `${string}@${string}.${string}`;

export type Service = "AUTH" | "FIRESTORE";

export type Deep<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? Deep<U>[]
    : T[K] extends Date
    ? Date
    : T[K] extends object
    ? Deep<T[K]>
    : T[K];
};
