export class ApiError extends Error {
  status?: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function toApiError(e: any): ApiError {
  const status = e?.response?.status;
  const message =
    e?.response?.data?.message ||
    e?.message ||
    "Error comunicando con el servidor";
  const data = e?.response?.data;
  return new ApiError(message, status, data);
}
