const IS_EMPTY = 0
const MORE_THAN_ONE = 1

export function IncludesSome<T>(an_array: T[], values_to_check: T[]): boolean {
  for (const a_value of values_to_check)
    if (an_array.includes(a_value))
      return true
  return false
}

export function IsEmpty(
  a_structure: unknown[] | string | object | null | undefined
): boolean {
  if (NotExist(a_structure))
    return true
  if (Array.isArray(a_structure))
    return ArrayIsEmpty(a_structure)
  if (typeof a_structure === "object")
    return ObjectIsEmpty(a_structure!)
  if (typeof a_structure === "string")
    return StringIsEmpty(a_structure)
  return true
}

export function IsNotEmpty(
  a_structure: unknown[] | string | object | null | undefined
): boolean {
  return !IsEmpty(a_structure)
}

export function ObjectIsEmpty(an_object: object): boolean {
  return Object.keys(an_object).length === IS_EMPTY
}

export function StringIsEmpty(an_string: string): boolean {
  return an_string.length === IS_EMPTY
}

export function ArrayIsEmpty(an_array: unknown[]): boolean {
  return an_array.length === IS_EMPTY
}

export function Exist(a_structure: unknown): boolean {
  return !(a_structure === null || a_structure === undefined)
}

export function NotExist(a_structure: unknown): boolean {
  return !Exist(a_structure)
}

export function SizeMoreThanOne(a_structure: string | unknown[]): boolean {
  return a_structure.length > MORE_THAN_ONE
}
