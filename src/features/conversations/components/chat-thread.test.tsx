import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatThread } from "./chat-thread";

let n = 0;
function msg(over: Record<string, unknown>) {
  n += 1;
  return {
    id: `m${n}`,
    leadId: "lead-1",
    channel: "email",
    direction: "outbound",
    status: "sent",
    supersedesId: null,
    content: `message ${n}`,
    sentAt: null,
    createdAt: `2026-09-24T09:0${n}:00Z`,
    ...over,
  };
}

describe("ChatThread", () => {
  it("shows the exchange oldest first, inbound and outbound as different bubbles", () => {
    const messages = [
      msg({ id: "late", content: "Merci, intéressé", direction: "inbound", status: null, createdAt: "2026-09-24T11:00:00Z" }),
      msg({ id: "early", content: "Bonjour, une idée pour vous", createdAt: "2026-09-24T09:00:00Z" }),
    ];
    render(<ChatThread messages={messages as never} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]!).getByText("Bonjour, une idée pour vous")).toBeInTheDocument();
    expect(items[0]).toHaveAttribute("data-kind", "sent");
    expect(within(items[1]!).getByText("Merci, intéressé")).toBeInTheDocument();
    expect(items[1]).toHaveAttribute("data-kind", "received");
  });

  it("marks drafts and discarded messages as NOT sent, visibly distinct from a sent one", () => {
    const messages = [
      msg({ content: "Envoyé pour de vrai", status: "sent" }),
      msg({ content: "Brouillon en attente", status: "pending_approval" }),
      msg({ content: "Version rejetée", status: "rejected" }),
      msg({ content: "Remplacé", status: "superseded" }),
      msg({ content: "Annulé", status: "cancelled" }),
    ];
    render(<ChatThread messages={messages as never} />);

    const byText = (text: string) => screen.getByText(text).closest("li")!;
    expect(byText("Envoyé pour de vrai")).toHaveAttribute("data-kind", "sent");
    expect(within(byText("Envoyé pour de vrai")).queryByText(/jamais envoyé|pas encore envoyé/i)).toBeNull();

    expect(byText("Brouillon en attente")).toHaveAttribute("data-kind", "awaiting");
    expect(within(byText("Brouillon en attente")).getByText(/pas encore envoyé/i)).toBeInTheDocument();
    for (const text of ["Version rejetée", "Remplacé", "Annulé"]) {
      expect(byText(text)).toHaveAttribute("data-kind", "discarded");
      expect(within(byText(text)).getByText(/jamais envoyé/i)).toBeInTheDocument();
    }
  });

  it("labels an unknown status neutrally instead of presenting it as sent", () => {
    render(<ChatThread messages={[msg({ content: "?", status: "future_status" })] as never} />);

    const item = screen.getByText("?").closest("li")!;
    expect(item).toHaveAttribute("data-kind", "unknown");
    expect(within(item).getByText(/Statut inconnu : future_status/)).toBeInTheDocument();
  });

  it("shows readable dates, not ISO strings", () => {
    render(<ChatThread messages={[msg({ createdAt: "2026-09-24T09:05:00Z" })] as never} />);
    expect(screen.queryByText(/2026-09-24T/)).not.toBeInTheDocument();
    expect(screen.getByText(/24 sept\. 2026/)).toBeInTheDocument();
  });

  it("says so when there is no message", () => {
    render(<ChatThread messages={[]} />);
    expect(screen.getByText("Aucun message dans cette conversation")).toBeInTheDocument();
  });
});
