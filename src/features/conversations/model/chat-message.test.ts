import { describe, expect, it } from "vitest";
import { chatMessageKind, sortChronologically } from "./chat-message";

const base = { id: "m", leadId: "l", channel: "email", supersedesId: null, content: "x", sentAt: null, createdAt: "2026-09-24T09:00:00Z" };

describe("chatMessageKind — only a real send counts as sent", () => {
  it("inbound is received", () => {
    expect(chatMessageKind({ ...base, direction: "inbound", status: null })).toBe("received");
  });

  it("outbound is 'sent' only with status sent", () => {
    expect(chatMessageKind({ ...base, direction: "outbound", status: "sent" })).toBe("sent");
  });

  it.each(["pending_approval", "approved"] as const)("outbound %s is a draft still awaiting sending", (status) => {
    expect(chatMessageKind({ ...base, direction: "outbound", status })).toBe("awaiting");
  });

  it.each(["rejected", "superseded", "cancelled"] as const)("outbound %s was never sent", (status) => {
    expect(chatMessageKind({ ...base, direction: "outbound", status })).toBe("discarded");
  });

  it("never guesses for a status or direction it does not know", () => {
    expect(chatMessageKind({ ...base, direction: "outbound", status: "future_status" })).toBe("unknown");
    expect(chatMessageKind({ ...base, direction: "outbound", status: null })).toBe("unknown");
    expect(chatMessageKind({ ...base, direction: "sideways", status: "sent" })).toBe("unknown");
  });
});

describe("sortChronologically", () => {
  it("orders oldest first by send time, falling back to creation time, without mutating the input", () => {
    const a = { ...base, id: "a", createdAt: "2026-09-24T10:00:00Z", sentAt: null };
    const b = { ...base, id: "b", createdAt: "2026-09-24T08:00:00Z", sentAt: "2026-09-24T09:30:00Z" };
    const c = { ...base, id: "c", createdAt: "2026-09-24T09:00:00Z", sentAt: null };
    const input = [a, b, c];

    expect(sortChronologically(input).map((m) => m.id)).toEqual(["c", "b", "a"]);
    expect(input.map((m) => m.id)).toEqual(["a", "b", "c"]);
  });
});
