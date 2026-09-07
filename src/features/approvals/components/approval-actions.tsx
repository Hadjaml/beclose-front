"use client";

import type { Approval, ApprovalDecisionOption } from "../model/approval";

interface ApprovalActionsProps {
  approval: Approval;
  onDecide?: (approval: Approval, option: ApprovalDecisionOption) => void;
}

export function ApprovalActions({ approval, onDecide }: ApprovalActionsProps) {
  if (
    approval.status !== "PENDING" ||
    onDecide === undefined ||
    approval.decisionOptions.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Décisions disponibles">
      {approval.decisionOptions.map((option, index) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onDecide(approval, option)}
          className={
            index === 0
              ? "min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-brand-navy-hover"
              : "min-h-10 rounded-app-md border border-border-strong bg-surface px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
