import { describe, expect, it } from "vitest";
import { summarizeConversations } from "./conversation-summaries";

const message = (id: string, leadId: string, createdAt: string, content = "texte") => ({
  id,
  leadId,
  channel: "email",
  direction: "outbound",
  status: "sent",
  supersedesId: null,
  content,
  sentAt: null,
  createdAt,
  evaluationStatus: null,
  evaluationAttempts: null,
});

describe("summarizeConversations", () => {
  it("groups messages by prospect, names them from the prospects list, most recent first", () => {
    const summaries = summarizeConversations(
      [
        message("1", "a", "2026-09-24T09:00:00Z"),
        message("2", "b", "2026-09-24T11:00:00Z", "dernier mot de b"),
        message("3", "a", "2026-09-24T10:00:00Z"),
      ],
      [
        { leadId: "a", company: { name: "Acme" }, contact: { fullName: "Ada", email: "ada@acme.fr" } },
        { leadId: "b", company: { name: "Bolt" }, contact: { fullName: null, email: "b@bolt.fr" } },
      ],
    );

    expect(summaries.map((s) => s.leadId)).toEqual(["b", "a"]);
    expect(summaries[0]).toMatchObject({ title: "Bolt", subtitle: "b@bolt.fr", messageCount: 1, lastPreview: "dernier mot de b" });
    expect(summaries[1]).toMatchObject({ title: "Acme", subtitle: "Ada", messageCount: 2 });
  });

  it("falls back to a short reference when the prospect is not in the loaded list", () => {
    const [summary] = summarizeConversations([message("1", "0123456789abcdef", "2026-09-24T09:00:00Z")], []);
    expect(summary?.title).toBe("Prospect 01234567");
  });

  it("truncates a long preview", () => {
    const [summary] = summarizeConversations([message("1", "a", "2026-09-24T09:00:00Z", "x".repeat(200))], []);
    expect(summary?.lastPreview.length).toBeLessThanOrEqual(81);
    expect(summary?.lastPreview.endsWith("…")).toBe(true);
  });

  it("previews only the new part of a prospect's reply, not the quote of our message", () => {
    const reply = {
      ...message("1", "a", "2026-09-24T09:00:00Z"),
      direction: "inbound",
      status: null,
      content: "Oui, intéressée !\n\nLe jeu. 24 sept. 2026 à 09:00, Bewise a écrit :\n> Bonjour Ada",
    };
    const [summary] = summarizeConversations([reply], []);
    expect(summary?.lastPreview).toBe("Oui, intéressée !");
  });
});
