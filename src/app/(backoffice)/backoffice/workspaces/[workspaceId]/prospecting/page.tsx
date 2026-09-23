import { LeadProspectsSection, SourcingRunSection } from "@/features/prospecting";

export default function WorkspaceProspectingPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-text-tertiary">Sourcing</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
            Prospection
          </h1>
          <p className="mt-3 text-base leading-7 text-text-secondary">
            Entreprises et contacts identifiés, avec leur position dans le pipeline.
            La validation de la stratégie de contact reste gérée sur Telegram.
          </p>
        </div>
        <SourcingRunSection />
      </header>

      <LeadProspectsSection />
    </div>
  );
}
