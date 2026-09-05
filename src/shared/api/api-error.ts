import { ZodError } from "zod";

export type ApiErrorKind =
  | "aborted"
  | "configuration"
  | "http"
  | "network"
  | "parse"
  | "validation"
  | "unknown";

interface ApiErrorOptions {
  kind: ApiErrorKind;
  message: string;
  cause?: unknown;
  status?: number;
  details?: unknown;
}

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly details: unknown;

  constructor({ kind, message, cause, status, details }: ApiErrorOptions) {
    super(message, { cause });
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.details = details;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof ZodError) {
    return new ApiError({
      kind: "validation",
      message: "The API response does not match the expected contract.",
      cause: error,
      details: error.issues,
    });
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({ kind: "aborted", message: "The API request was cancelled.", cause: error });
  }
  if (error instanceof TypeError) {
    return new ApiError({ kind: "network", message: "The API could not be reached.", cause: error });
  }
  return new ApiError({ kind: "unknown", message: "An unexpected API error occurred.", cause: error });
}
