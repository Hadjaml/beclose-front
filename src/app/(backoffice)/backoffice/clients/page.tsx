import Link from "next/link";
import { ClientsPageContent } from "@/features/clients";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-text-tertiary">Organisations clientes</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">Clients</h1>
          <p className="mt-3 text-base leading-7 text-text-secondary">Suivez ici la préparation et l’état des systèmes de chaque client.</p>
        </div>
        {/* Persistent, not just in the empty state (`ClientsEmptyState`) —
            found missing 2026-09-23: with at least one client already in
            base, the list is never empty, so that empty-state-only button
            never showed up on the real page. */}
        <Link
          href="/backoffice/clients/new"
          className="brand-gradient-action brand-gradient-hover shrink-0 rounded-app-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          Nouveau client
        </Link>
      </header>
      <ClientsPageContent />
    </div>
  );
}
