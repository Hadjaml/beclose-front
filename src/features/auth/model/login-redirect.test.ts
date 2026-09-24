import { describe, expect, it } from "vitest";
import { loginUrlWithReturn, safeLoginRedirect } from "./login-redirect";

describe("safeLoginRedirect", () => {
  it("keeps an in-app path inside a known area, with its query", () => {
    expect(safeLoginRedirect("/backoffice/clients?includeArchived=true")).toBe(
      "/backoffice/clients?includeArchived=true",
    );
    expect(safeLoginRedirect("/portal/ws-1/approvals")).toBe("/portal/ws-1/approvals");
    expect(safeLoginRedirect("/backoffice")).toBe("/backoffice");
  });

  it.each([
    ["absolute URL", "https://evil.example/backoffice"],
    ["protocol-relative", "//evil.example"],
    ["backslash trick", "/\\evil.example"],
    ["unknown area", "/admin"],
    ["lookalike prefix", "/backofficeevil"],
    ["empty", ""],
  ])("falls back to the back office for %s", (_label, raw) => {
    expect(safeLoginRedirect(raw)).toBe("/backoffice");
  });

  it("falls back when absent", () => {
    expect(safeLoginRedirect(undefined)).toBe("/backoffice");
    expect(safeLoginRedirect(null)).toBe("/backoffice");
  });
});

describe("loginUrlWithReturn", () => {
  it("encodes the current path as the return target", () => {
    expect(loginUrlWithReturn("/backoffice/clients?a=1")).toBe(
      "/login?redirectTo=%2Fbackoffice%2Fclients%3Fa%3D1",
    );
  });
});
