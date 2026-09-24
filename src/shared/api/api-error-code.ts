import { ApiError } from "./api-error";

/**
 * Beclose's machine-readable error code (`{ error: { code, message } }`,
 * e.g. `SOURCING_RUN_ALREADY_IN_PROGRESS`) when the failure was an HTTP
 * error carrying that envelope, otherwise `null`. Lets a feature tell two
 * failures with the same HTTP status apart (both 409s below) without
 * parsing `details` by hand each time.
 */
export function getApiErrorCode(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  const details = error.details;
  if (typeof details !== "object" || details === null || !("error" in details)) return null;
  const envelope = details.error;
  if (typeof envelope !== "object" || envelope === null || !("code" in envelope)) return null;
  return typeof envelope.code === "string" ? envelope.code : null;
}

/** Beclose's human-readable `error.message` (French, written for a person)
 * when present — e.g. the exact reason an outcome was refused. `null` when
 * there is none, so callers can fall back to their own wording. */
export function getApiErrorMessage(error: unknown): string | null {
  if (!(error instanceof ApiError)) return null;
  const details = error.details;
  if (typeof details !== "object" || details === null || !("error" in details)) return null;
  const envelope = details.error;
  if (typeof envelope !== "object" || envelope === null || !("message" in envelope)) return null;
  return typeof envelope.message === "string" && envelope.message !== "" ? envelope.message : null;
}
