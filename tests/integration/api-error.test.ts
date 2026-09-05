import { describe, expect, it } from "vitest";
import {
  ApiError,
  getApiErrorPresentation,
} from "@/shared/api/api-error";

describe("API error presentation", () => {
  it("distinguishes an expired session without exposing details", () => {
    const error = new ApiError({
      kind: "http",
      message: "Internal transport message",
      status: 401,
      details: { internal: "must not be rendered" },
      requestId: "request-test",
    });
    expect(getApiErrorPresentation(error)).toEqual({
      title: "Session expirée",
      description: "Reconnectez-vous pour continuer.",
      sessionExpired: true,
      requestId: "request-test",
    });
  });
});
