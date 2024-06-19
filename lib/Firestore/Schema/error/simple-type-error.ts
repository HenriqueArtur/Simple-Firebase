import { NotExist } from "@src/language-functions.js"

export class SimpleTypeError extends Error {
  constructor(
    msg: string,
    public readonly errors: SimpleTypeErrorItem[]
  ) {
    super(msg)
  }
}

export interface SimpleTypeErrorItem {
  key: string,
  descriptions: string[]
}

export function createSimpleTypeErrorItem(key: string, validation_list: ValidationTuple[]): SimpleTypeErrorItem {
  return {
    key,
    descriptions: runChainOfValidations(validation_list)
  }
}

export type ValidationTuple = [expression: boolean, error: string]
export function runChainOfValidations(
  [current_tuple, ...chain]: ValidationTuple[],
  errors_list: string[] = []
) {
  if (NotExist(current_tuple)) return errors_list
  const [expression, error] = current_tuple
  if (expression) return runChainOfValidations(chain, [...errors_list, error])
  return runChainOfValidations(chain, errors_list)
}
