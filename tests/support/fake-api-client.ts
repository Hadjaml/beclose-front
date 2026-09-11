import type { ApiClient, ApiRequestOptions } from "@/shared/api/api-client";

/**
 * Mimics createApiClient's contract for unit tests: parses whatever
 * `handler` returns through the schema the caller passed, without a real
 * fetch. Shared across every feature's `*-api.test.ts` (originally defined
 * only in auth-api.test.ts).
 */
export function fakeClient(
  handler: (path: string, options: ApiRequestOptions<unknown>) => unknown,
): ApiClient {
  return {
    request: (path, options) => Promise.resolve(options.schema.parse(handler(path, options))),
  };
}

export function rejectingClient(error: unknown): ApiClient {
  return { request: () => Promise.reject(error) };
}
