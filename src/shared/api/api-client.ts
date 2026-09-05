import type { ZodType } from "zod";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { ApiError, normalizeApiError } from "./api-error";

type ApiMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
type QueryValue = boolean | number | string | null | undefined;

export interface ApiRequestContext {
  workspaceId?: WorkspaceId;
  delegationId?: string;
}

export interface ApiClientOptions {
  baseUrl: string;
  fetchImplementation?: typeof fetch;
  resolveHeaders?: (context: ApiRequestContext) => HeadersInit | Promise<HeadersInit>;
}

export interface ApiRequestOptions<T> {
  method?: ApiMethod;
  body?: unknown;
  context?: ApiRequestContext;
  headers?: HeadersInit;
  query?: Readonly<Record<string, QueryValue>>;
  schema: ZodType<T>;
  signal?: AbortSignal;
}

export interface WorkspaceApiRequestOptions<T> extends Omit<ApiRequestOptions<T>, "context"> {
  context: ApiRequestContext & { workspaceId: WorkspaceId };
}

export interface ApiClient {
  request: <T>(path: string, options: ApiRequestOptions<T>) => Promise<T>;
}

function buildUrl(baseUrl: string, path: string, query?: Readonly<Record<string, QueryValue>>): URL {
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  if (query !== undefined) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url;
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      return await response.json();
    } catch (error) {
      throw new ApiError({
        kind: "parse",
        message: "The API returned invalid JSON.",
        cause: error,
        status: response.status,
      });
    }
  }
  return response.text();
}

export function createApiClient({ baseUrl, fetchImplementation = fetch, resolveHeaders }: ApiClientOptions): ApiClient {
  let normalizedBaseUrl: URL;
  try {
    normalizedBaseUrl = new URL(baseUrl);
  } catch (error) {
    throw new ApiError({ kind: "configuration", message: "The API base URL is invalid.", cause: error });
  }

  return {
    async request<T>(path: string, options: ApiRequestOptions<T>): Promise<T> {
      try {
        const contextualHeaders = await resolveHeaders?.(options.context ?? {});
        const headers = new Headers(contextualHeaders);
        new Headers(options.headers).forEach((value, key) => headers.set(key, value));
        if (options.body !== undefined && !headers.has("content-type")) {
          headers.set("content-type", "application/json");
        }
        const requestInit: RequestInit = {
          method: options.method ?? "GET",
          headers,
          credentials: "include",
          ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
          ...(options.signal === undefined ? {} : { signal: options.signal }),
        };
        const response = await fetchImplementation(
          buildUrl(normalizedBaseUrl.href, path, options.query),
          requestInit,
        );
        const responseBody = await readResponseBody(response);
        if (!response.ok) {
          throw new ApiError({
            kind: "http",
            message: `The API request failed with status ${response.status}.`,
            status: response.status,
            details: responseBody,
          });
        }
        return options.schema.parse(responseBody);
      } catch (error) {
        throw normalizeApiError(error);
      }
    },
  };
}
