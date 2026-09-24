import { describe, expect, it } from "vitest";
import {
  describeGmailDisconnection,
  describeTelegramDisconnection,
} from "./archive-disconnections";

describe("archive disconnection wording", () => {
  it("reports a clean revocation/departure as done", () => {
    expect(describeGmailDisconnection("revoked").outcome).toBe("done");
    expect(describeTelegramDisconnection("left_group").outcome).toBe("done");
  });

  it("reports nothing-to-disconnect as such", () => {
    expect(describeGmailDisconnection("none").outcome).toBe("nothing");
    expect(describeTelegramDisconnection("none").outcome).toBe("nothing");
  });

  it("flags every *_locally_only status as a manual check, never a plain OK", () => {
    expect(describeGmailDisconnection("removed_locally_only").outcome).toBe("manual-check");
    expect(describeTelegramDisconnection("cleared_locally_only").outcome).toBe("manual-check");
  });

  it("treats a status it does not know yet as a manual check", () => {
    const report = describeGmailDisconnection("something_new");
    expect(report.outcome).toBe("manual-check");
    expect(report.detail).toContain("something_new");
  });
});
