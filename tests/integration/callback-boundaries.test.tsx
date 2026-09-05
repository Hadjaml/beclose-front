import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApprovalActions, approvalSchema } from "@/features/approvals";
import { HandoffActions } from "@/features/human-handoff";

describe("mutation callback boundaries", () => {
  it("does not render handoff actions without callbacks", () => {
    render(
      <HandoffActions ownership={{ owner: "AGENT", agentState: "ACTIVE" }} />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render approval decisions without a callback", () => {
    const approval = approvalSchema.parse({
      id: "approval-test",
      workspaceId: "workspace-a",
      type: "PROSPECT_DECISION",
      domain: "PROSPECTING",
      title: "Décision requise",
      decisionOptions: [{ id: "approve", label: "Valider" }],
      priority: "MEDIUM",
      createdAt: "2026-09-05T12:00:00+02:00",
      status: "PENDING",
    });
    render(<ApprovalActions approval={approval} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
