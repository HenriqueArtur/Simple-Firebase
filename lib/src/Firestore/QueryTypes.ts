import { Timestamp } from "firebase/firestore";

export type LogicalOperators = "$AND" | "$OR";

export type AttributeOperatorsNumber =
  | "$LESS"
  | "$LESS_OR_EQ"
  | "$EQ"
  | "$GREATER_OR_EQ"
  | "$GREATER";

export type AttributeOperatorsArray = "$ARRAY_CONTAINS" | "$ARRAY_CONTAINS_ANY";

export type AttributeOperatorsAggregation = "$IN" | "$NOT_IN";

export type AttributeOperatorsNot = "$NOT";

export type AttributeOperators =
  | AttributeOperatorsNumber
  | AttributeOperatorsArray
  | AttributeOperatorsAggregation
  | AttributeOperatorsNot;

export type QueryOperators = LogicalOperators | AttributeOperators;

export type SimpleQuery<T extends object> = {
  where: Where<T>;
  orderBy?: OrderBy<T>;
  offset?: number;
  limit?: number;
};

// Find one way to make a DISJUNCTION here
export type Where<T extends object> =
  | { $AND: CompoundQuery<CompoundWithLogicOperators<T>> }
  | { $OR: CompoundQuery<CompoundWithLogicOperators<T>> }
  | CompoundWithoutLogicOperators<CompoundQuery<T>>;

export type CompoundWithLogicOperators<T> = {
  [K in keyof T]?: T[K];
} & { $AND?: T; $OR?: T };

export type CompoundWithoutLogicOperators<T> = {
  [K in keyof T]?: T[K];
};

export type CompoundQuery<T> = {
  [K in keyof T]?: K extends LogicalOperators
    ? CompoundQuery<T>
    : T[K] extends (infer U)[]
    ? U extends object | (infer _A)[]
      ? never
      : CompoundArray<U>
    : AttributesQuery<T[K]>;
};

export type CompoundArray<T> =
  | {
      [K in AttributeOperatorsArray]?: K extends "$ARRAY_CONTAINS" ? T : T[];
    }
  | T[];

export type AttributesQuery<T> = IsOperators<T> | IsNested<T> | T;

export type IsOperators<T> = {
  [K in AttributeOperators]?: K extends "$EQ"
    ? T
    : K extends AttributeOperatorsNumber
    ? T extends number
      ? number
      : Timestamp
    : K extends AttributeOperatorsNot
    ? T
    : T[];
};

export type IsNested<T> = {
  [N in keyof T]?: AttributesQuery<T[N]>;
};

export type OrderBy<T> = {
  [O in keyof T]?: T[O] extends object ? OrderBy<T[O]> : AnOrderByDirection;
};

export type AnOrderByDirection = "ASC" | "DESC";
