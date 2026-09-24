import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/api-error";
import { ReevaluationPanel } from "./reevaluation-panel";

const messagesMock = vi.hoisted(() => vi.fn());
const requestMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/supervision", () => ({ useMessageLogQuery: messagesMock }));
vi.mock("../api/use-request-reevaluation-mutation", () => ({
  useRequestReevaluationMutation: () => useMutation({ mutationFn: requestMock }),
}));

const inbound = (over: Record<string, unknown> = {}) => ({
  id: "m1",
  leadId: "lead-1",
  channel: "email",
  direction: "inbound",
  status: null,
  supersedesId: null,
  content: "Réponse",
  sentAt: null,
  createdAt: "2026-09-24T09:00:00Z",
  evaluationStatus: "failed",
  evaluationAttempts: 1,
  ...over,
});
const messages = (data: unknown[]) => ({ isSuccess: true, data: { data, pagination: { limit: 200, offset: 0, total: data.length } } });

function renderPanel() {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ReevaluationPanel workspaceId="ws-1" leadId="lead-1" />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  messagesMock.mockReset();
  requestMock.mockReset();
});

describe("ReevaluationPanel (audit C09: a failed qualification can be retried without a new reply)", () => {
  it("offers 'Relancer l’évaluation' when the latest inbound message failed, and posts once confirmed", async () => {
    requestMock.mockResolvedValue({ leadId: "lead-1", status: "requested" });
    messagesMock.mockReturnValue(messages([inbound()]));
    renderPanel();

    expect(screen.getByText(/L’évaluation de la dernière réponse a échoué/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Relancer l’évaluation" }));
    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/moins d’une minute/)).toBeInTheDocument();
  });

  it("exhausted says the automatic attempts are over (alert already sent) and still offers a retry", () => {
    messagesMock.mockReturnValue(messages([inbound({ evaluationStatus: "exhausted", evaluationAttempts: 3 })]));
    renderPanel();

    expect(screen.getByText(/3 tentatives/)).toBeInTheDocument();
    expect(screen.getByText(/alerte/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Relancer l’évaluation" })).toBeInTheDocument();
  });

  it("pending is shown as in progress, with no button", () => {
    messagesMock.mockReturnValue(messages([inbound({ evaluationStatus: "pending", evaluationAttempts: 0 })]));
    renderPanel();

    expect(screen.getByText(/Évaluation en cours ou à reprendre/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Relancer l’évaluation" })).not.toBeInTheDocument();
  });

  it("only the MOST RECENT inbound message counts: an old failure followed by a done evaluation shows nothing", () => {
    messagesMock.mockReturnValue(
      messages([
        inbound({ id: "old", evaluationStatus: "failed", createdAt: "2026-09-24T08:00:00Z" }),
        inbound({ id: "new", evaluationStatus: "done", createdAt: "2026-09-24T10:00:00Z" }),
      ]),
    );
    renderPanel();

    expect(screen.queryByRole("button", { name: "Relancer l’évaluation" })).not.toBeInTheDocument();
  });

  it("ignores outbound messages and messages without an evaluation status (older backend / null)", () => {
    messagesMock.mockReturnValue(
      messages([
        { ...inbound(), id: "out", direction: "outbound", evaluationStatus: null, createdAt: "2026-09-24T11:00:00Z" },
        inbound({ id: "legacy", evaluationStatus: null }),
      ]),
    );
    renderPanel();

    expect(screen.queryByRole("button", { name: "Relancer l’évaluation" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Évaluation/)).not.toBeInTheDocument();
  });

  it("an unknown evaluation status offers nothing and does not guess", () => {
    messagesMock.mockReturnValue(messages([inbound({ evaluationStatus: "brand_new" })]));
    renderPanel();

    expect(screen.queryByRole("button", { name: "Relancer l’évaluation" })).not.toBeInTheDocument();
  });

  it("explains a 409 REEVALUATION_NOT_NEEDED", async () => {
    requestMock.mockRejectedValueOnce(
      new ApiError({ kind: "http", message: "c", status: 409, details: { error: { code: "REEVALUATION_NOT_NEEDED", message: "Rien à relancer." } } }),
    );
    messagesMock.mockReturnValue(messages([inbound()]));
    renderPanel();

    await userEvent.click(screen.getByRole("button", { name: "Relancer l’évaluation" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Rien à relancer.");
  });
});
