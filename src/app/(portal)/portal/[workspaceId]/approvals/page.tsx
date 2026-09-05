import { ApprovalList } from "@/features/approvals";

export default function PortalApprovalsPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500">Votre intervention</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">À valider</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Prenez connaissance des recommandations qui attendent votre décision.
        </p>
      </header>
      <ApprovalList approvals={null} />
    </div>
  );
}
