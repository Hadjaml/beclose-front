import { supervisionPriorityLabels } from "@/features/supervision";
import {
  approvalStatusLabels,
  type Approval,
} from "../model/approval";

interface ApprovalCardProps {
  approval: Approval;
  onOpen?: (approval: Approval) => void;
}

export function ApprovalCard({ approval, onOpen }: ApprovalCardProps) {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-secondary">
          {approvalStatusLabels[approval.status]}
        </span>
        <span className="text-xs font-medium text-text-tertiary">
          Priorité {supervisionPriorityLabels[approval.priority].toLowerCase()}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-text-primary">{approval.title}</h3>
      {approval.context === undefined ? null : (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-secondary">
          {approval.context}
        </p>
      )}
      {approval.recommendation === undefined ? null : (
        <p className="mt-3 text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Recommandation : </span>
          {approval.recommendation.summary}
        </p>
      )}
    </>
  );

  if (onOpen === undefined) {
    return <article className="rounded-app-lg border border-border bg-surface p-5">{content}</article>;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(approval)}
      className="w-full rounded-app-lg border border-border bg-surface p-5 text-left hover:border-border-strong hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
    >
      {content}
    </button>
  );
}
