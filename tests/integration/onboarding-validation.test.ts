import { describe, expect, it } from "vitest";
import { companyStepSchema } from "@/features/onboarding";

describe("onboarding validation", () => {
  it("keeps essential company information required", () => {
    const result = companyStepSchema.safeParse({
      companyName: "",
      website: "",
      industry: "",
      description: "",
      primaryMarket: "",
      companySize: "",
      primaryContactName: "",
      primaryContactEmail: "",
    });
    expect(result.success).toBe(false);
  });
});
