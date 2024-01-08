export function flattenObject(obj: Record<string, any>, parentKey = ""): Record<string, any> {
  let result: Record<string, any> = {};
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nestedObject = flattenObject(obj[key], newKey);
      result = { ...result, ...nestedObject };
      continue;
    }
    result[newKey] = obj[key];
  }
  return result;
}
