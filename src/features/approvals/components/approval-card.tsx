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
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
          {approvalStatusLabels[approval.status]}
        </span>
        <span className="text-xs font-medium text-zinc-500">
          Priorité {supervisionPriorityLabels[approval.priority].toLowerCase()}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-zinc-950">{approval.title}</h3>
      {approval.context === undefined ? null : (
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
          {approval.context}
        </p>
      )}
      {approval.recommendation === undefined ? null : (
        <p className="mt-3 text-sm text-zinc-700">
          <span className="font-semibold text-zinc-950">Recommandation : </span>
          {approval.recommendation.summary}
        </p>
      )}
    </>
  );

  if (onOpen === undefined) {
    return <article className="rounded-xl border border-zinc-200 bg-white p-5">{content}</article>;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(approval)}
      className="w-full rounded-xl border border-zinc-200 bg-white p-5 text-left hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
    >
      {content}
    </button>
  );
}
