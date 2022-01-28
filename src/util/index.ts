import { ErrorObject } from "ajv";

export function extractAjvErrors(
  ajvErrors:
    | ErrorObject<string, Record<string, any>, unknown>[]
    | null
    | undefined
) {
  return ajvErrors?.map((error) => ({
    key: error.instancePath.slice(1),
    params: error.params,
    message: error.message,
  }));
}
