import HttpStatusCode from "../constants/HttpStatusCode";

export function createdView(message: string | Record<string, any>) {
  return {
    success: true,
    message,
    code: HttpStatusCode.CREATED,
  };
}

export function errorView(
  message: string | Record<string, any>,
  code?: HttpStatusCode
) {
  return {
    success: false,
    message,
    code: code || HttpStatusCode.INTERNAL_SERVER_ERROR,
  };
}

export function successView(data: any, total: number) {
  return {
    success: true,
    code: HttpStatusCode.OK,
    total,
    data,
  };
}
