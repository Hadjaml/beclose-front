import { ProspectingView } from "@/features/prospecting";

export default function WorkspaceProspectingPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-text-tertiary">Validation humaine</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Prospection
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Examinez les prospects proposés, validez la décision de ciblage puis la stratégie de contact.
        </p>
      </header>

      <ProspectingView prospects={null} />
    </div>
  );
}
