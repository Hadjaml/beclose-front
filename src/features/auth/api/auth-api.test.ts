import { describe, expect, it, vi } from "vitest";
import type { ApiClient, ApiRequestOptions } from "@/shared/api/api-client";
import { ApiError } from "@/shared/api/api-error";
import { createAuthApi } from "./auth-api";

/** Mimics createApiClient's contract: parses the raw response through
 * whatever schema the caller passed, without a real fetch. */
function fakeClient(
  handler: (path: string, options: ApiRequestOptions<unknown>) => unknown,
): ApiClient {
  return {
    request: (path, options) => Promise.resolve(options.schema.parse(handler(path, options))),
  };
}

function rejectingClient(error: unknown): ApiClient {
  return { request: () => Promise.reject(error) };
}

describe("createAuthApi", () => {
  it("login() posts credentials and returns the transformed session", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/auth/login");
      expect(options.method).toBe("POST");
      expect(options.body).toEqual({ email: "a@b.com", password: "secret" });
      return { id: "u1", email: "a@b.com", full_name: "Ada Lovelace" };
    });

    const session = await createAuthApi(client).login({ email: "a@b.com", password: "secret" });

    expect(session).toEqual({ user: { id: "u1", email: "a@b.com", displayName: "Ada Lovelace" } });
  });

  it("getCurrentSession() returns the session on success", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/auth/me");
      expect(options.method).toBe("GET");
      return { id: "u1", email: "a@b.com", full_name: "Ada Lovelace" };
    });

    await expect(createAuthApi(client).getCurrentSession()).resolves.toEqual({
      user: { id: "u1", email: "a@b.com", displayName: "Ada Lovelace" },
    });
  });

  it("getCurrentSession() returns null on a 401 instead of throwing", async () => {
    const client = rejectingClient(new ApiError({ kind: "http", message: "x", status: 401 }));

    await expect(createAuthApi(client).getCurrentSession()).resolves.toBeNull();
  });

  it("getCurrentSession() rethrows a non-401 error", async () => {
    const client = rejectingClient(new ApiError({ kind: "http", message: "x", status: 500 }));

    await expect(createAuthApi(client).getCurrentSession()).rejects.toMatchObject({ status: 500 });
  });

  it("logout() posts to /auth/logout and expects no body", async () => {
    const client = fakeClient((path, options) => {
      expect(path).toBe("/auth/logout");
      expect(options.method).toBe("POST");
      return undefined;
    });

    await expect(createAuthApi(client).logout()).resolves.toBeUndefined();
  });

  it("requestPasswordReset()/resetPassword() reject as unsupported without calling the backend", async () => {
    const request = vi.fn();
    const auth = createAuthApi({ request });

    await expect(auth.requestPasswordReset({ email: "a@b.com" })).rejects.toMatchObject({
      kind: "unsupported",
    });
    await expect(
      auth.resetPassword({ resetToken: "t", password: "newpassword123" }),
    ).rejects.toMatchObject({ kind: "unsupported" });
    expect(request).not.toHaveBeenCalled();
  });
});
