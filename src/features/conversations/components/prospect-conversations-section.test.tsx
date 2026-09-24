import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProspectConversationsSection } from "./prospect-conversations-section";

const messageLogMock = vi.hoisted(() => vi.fn());
const prospectsMock = vi.hoisted(() => vi.fn());

vi.mock("@/shared/workspace/workspace-context", () => ({
  useWorkspace: () => ({ activeWorkspaceId: "org-1" }),
}));
vi.mock("@/features/supervision", async () => {
  const actual = await vi.importActual<typeof import("@/features/supervision")>("@/features/supervision");
  return { ...actual, useMessageLogQuery: messageLogMock };
});
vi.mock("@/features/prospecting", () => ({ useLeadProspectsQuery: prospectsMock }));

const m = (id: string, leadId: string, over: Record<string, unknown> = {}) => ({
  id,
  leadId,
  channel: "email",
  direction: "outbound",
  status: "sent",
  supersedesId: null,
  content: `contenu ${id}`,
  sentAt: null,
  createdAt: "2026-09-24T09:00:00Z",
  ...over,
});
const page = (data: unknown[], total = data.length) => ({
  isPending: false,
  isError: false,
  isSuccess: true,
  data: { data, pagination: { limit: 200, offset: 0, total } },
});

const prospects = {
  isSuccess: true,
  data: {
    data: [
      { leadId: "a", company: { name: "Acme" }, contact: { fullName: "Ada", email: "ada@acme.fr" } },
      { leadId: "b", company: { name: "Bolt" }, contact: { fullName: null, email: "b@bolt.fr" } },
    ],
  },
};

beforeEach(() => {
  messageLogMock.mockReset();
  prospectsMock.mockReset();
  prospectsMock.mockReturnValue(prospects);
});

function useLogs(all: unknown[], perLead: Record<string, unknown[]>) {
  messageLogMock.mockImplementation((_ws: string, query: { leadId?: string }) =>
    query.leadId === undefined ? page(all) : page(perLead[query.leadId] ?? []),
  );
}

describe("ProspectConversationsSection (audit C02)", () => {
  it("lists prospects that have messages and shows the selected one as a chat", async () => {
    const a1 = m("a1", "a", { content: "Bonjour Ada" });
    const a2 = m("a2", "a", { content: "Oui, intéressée", direction: "inbound", status: null, createdAt: "2026-09-24T10:00:00Z" });
    const b1 = m("b1", "b", { content: "Salut Bolt", createdAt: "2026-09-24T12:00:00Z" });
    useLogs([a1, a2, b1], { a: [a1, a2], b: [b1] });
    render(<ProspectConversationsSection />);

    const list = screen.getByRole("list", { name: "Conversations" });
    const entries = within(list).getAllByRole("button");
    expect(entries[0]).toHaveTextContent("Bolt"); // most recent first
    expect(entries[1]).toHaveTextContent("Acme");

    const boltThread = screen.getByRole("region", { name: "Conversation avec Bolt" });
    expect(within(boltThread).getByText("Salut Bolt")).toBeInTheDocument();

    await userEvent.click(entries[1]!);
    const adaThread = screen.getByRole("region", { name: "Conversation avec Acme" });
    expect(within(adaThread).getByText("Bonjour Ada")).toBeInTheDocument();
    expect(within(adaThread).getByText("Oui, intéressée").closest("li")).toHaveAttribute("data-kind", "received");
  });

  it("never shows the contradictory 'Aucune conversation' when messages exist", () => {
    const a1 = m("a1", "a");
    useLogs([a1], { a: [a1] });
    render(<ProspectConversationsSection />);

    expect(screen.queryByText(/Aucune conversation/)).not.toBeInTheDocument();
  });

  it("says there is nothing when there really is no message", () => {
    useLogs([], {});
    render(<ProspectConversationsSection />);

    expect(screen.getByText("Aucun message échangé pour le moment")).toBeInTheDocument();
  });

  it("warns when only the most recent messages were loaded", () => {
    messageLogMock.mockImplementation((_ws: string, query: { leadId?: string }) =>
      query.leadId === undefined ? page([m("a1", "a")], 450) : page([m("a1", "a")]),
    );
    render(<ProspectConversationsSection />);

    expect(screen.getByText(/plus récents/)).toBeInTheDocument();
  });

  it("still lists conversations, with a short reference, when the prospects list cannot be read", () => {
    prospectsMock.mockReturnValue({ isSuccess: false, data: undefined });
    const a1 = m("a1", "0123456789");
    useLogs([a1], { "0123456789": [a1] });
    render(<ProspectConversationsSection />);

    expect(screen.getAllByText("Prospect 01234567").length).toBeGreaterThan(0);
  });

  it("shows an error with a retry when the messages cannot be loaded", () => {
    messageLogMock.mockReturnValue({ isPending: false, isError: true, isSuccess: false, refetch: vi.fn() });
    render(<ProspectConversationsSection />);

    expect(screen.getByText("Impossible de charger les conversations")).toBeInTheDocument();
  });
});
