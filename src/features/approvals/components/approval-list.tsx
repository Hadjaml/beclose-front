import { EmptyState } from "@/shared/ui/states";
import type { Approval } from "../model/approval";
import { ApprovalCard } from "./approval-card";

interface ApprovalListProps {
  approvals: readonly Approval[] | null;
  onOpen?: (approval: Approval) => void;
}

export function ApprovalList({ approvals, onOpen }: ApprovalListProps) {
  if (approvals === null || approvals.length === 0) {
    return (
      <EmptyState
        title="Aucune validation en attente"
        description="Les décisions qui nécessitent votre avis apparaîtront ici."
      />
    );
  }

  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {approvals.map((approval) => (
        <li key={approval.id}>
          <ApprovalCard
            approval={approval}
            {...(onOpen === undefined ? {} : { onOpen })}
          />
        </li>
      ))}
    </ul>
  );
}
