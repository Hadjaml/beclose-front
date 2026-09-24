import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import { WorkspaceAppointmentsSection } from "./workspace-appointments-section";

const queryMock = vi.hoisted(() => vi.fn());

vi.mock("@/shared/workspace/workspace-context", () => ({
  useWorkspace: () => ({ activeWorkspaceId: "org-1" }),
}));
vi.mock("../api/use-workspace-appointments-query", () => ({
  useWorkspaceAppointmentsQuery: queryMock,
}));

const appt = (over: Record<string, unknown> = {}) => ({
  id: "a1",
  scheduledAt: "2026-10-01T09:00:00Z",
  status: "confirmed",
  externalEventId: "evt",
  eventUrl: "https://www.google.com/calendar/event?eid=abc",
  leadId: "lead-1",
  company: { id: "c1", name: "Acme" },
  contact: { fullName: "Ada Lovelace", email: "ada@acme.fr", role: "CEO" },
  ...over,
});
const success = (data: unknown[], total = data.length) => ({
  isPending: false,
  isError: false,
  isSuccess: true,
  data: { data, pagination: { limit: 200, offset: 0, total } },
});

beforeEach(() => queryMock.mockReset());

describe("WorkspaceAppointmentsSection (audit C01)", () => {
  it("shows a confirmed appointment with its date, prospect, contact and calendar link", () => {
    queryMock.mockReturnValue(success([appt()]));
    render(<WorkspaceAppointmentsSection />);

    const row = screen.getByText("Acme").closest("li")!;
    expect(within(row).getByRole("link", { name: "Acme" })).toHaveAttribute(
      "href",
      "/backoffice/workspaces/org-1/prospecting/lead-1",
    );
    expect(within(row).getByText(/Ada Lovelace/)).toBeInTheDocument();
    expect(within(row).getByText("Confirmé")).toBeInTheDocument();
    expect(within(row).getByText(/1 oct\. 2026/)).toBeInTheDocument();
    expect(within(row).queryByText(/2026-10-01T/)).not.toBeInTheDocument();
    const calendar = within(row).getByRole("link", { name: /Google Agenda/ });
    expect(calendar).toHaveAttribute("href", "https://www.google.com/calendar/event?eid=abc");
    expect(calendar).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("shows an appointment without a calendar link (confirmed before the field existed) — no broken link", () => {
    queryMock.mockReturnValue(success([appt({ eventUrl: null })]));
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Google Agenda/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Lien Google Agenda indisponible/)).toBeInTheDocument();
  });

  it("never opens a non-http(s) calendar link", () => {
    queryMock.mockReturnValue(success([appt({ eventUrl: "javascript:alert(1)" })]));
    render(<WorkspaceAppointmentsSection />);

    expect(screen.queryByRole("link", { name: /Google Agenda/ })).not.toBeInTheDocument();
  });

  it("labels an unknown status neutrally", () => {
    queryMock.mockReturnValue(success([appt({ status: "rescheduled" })]));
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText(/Statut inconnu : rescheduled/)).toBeInTheDocument();
  });

  it("says so when there is truly no confirmed appointment", () => {
    queryMock.mockReturnValue(success([]));
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText("Aucun rendez-vous confirmé")).toBeInTheDocument();
  });

  it("warns when more appointments exist than are shown", () => {
    queryMock.mockReturnValue(success([appt()], 350));
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText(/1 sur 350/)).toBeInTheDocument();
  });

  it("stays 'not available' when the server does not offer the endpoint yet (404)", () => {
    queryMock.mockReturnValue({
      isPending: false,
      isError: true,
      isSuccess: false,
      error: new ApiError({ kind: "http", message: "nf", status: 404 }),
      refetch: vi.fn(),
    });
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText("Non disponible dans cette version")).toBeInTheDocument();
  });

  it("offers a retry on any other failure", () => {
    queryMock.mockReturnValue({
      isPending: false,
      isError: true,
      isSuccess: false,
      error: new ApiError({ kind: "http", message: "boom", status: 500 }),
      refetch: vi.fn(),
    });
    render(<WorkspaceAppointmentsSection />);

    expect(screen.getByText("Impossible de charger les rendez-vous")).toBeInTheDocument();
  });
});
