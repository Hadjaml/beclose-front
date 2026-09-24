"use client";

import { useState } from "react";
import { ErrorState, LoadingState } from "@/shared/ui/states";
import type { ArchiveResult } from "../api/clients-api";
import { useClientsQuery } from "../api/use-clients-query";
import { ArchiveResultBanner } from "./archive-result-banner";
import { ClientsList } from "./clients-list";

export function ClientsPageContent() {
  const [includeArchived, setIncludeArchived] = useState(false);
  const [archiveResult, setArchiveResult] = useState<ArchiveResult | null>(null);
  const query = useClientsQuery({ includeArchived });

  return (
    <div className="space-y-4">
      {archiveResult === null ? null : (
        <ArchiveResultBanner result={archiveResult} onDismiss={() => setArchiveResult(null)} />
      )}
      <label className="flex w-fit items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={includeArchived}
          onChange={(event) => setIncludeArchived(event.target.checked)}
          className="size-4 rounded border-border"
        />
        Afficher les archivées
      </label>
      {query.isPending ? <LoadingState label="Chargement des clients…" /> : null}
      {query.isError ? (
        <ErrorState
          title="Impossible de charger les clients"
          onRetry={() => void query.refetch()}
        />
      ) : null}
      {query.isSuccess ? <ClientsList clients={query.data} onArchived={setArchiveResult} /> : null}
    </div>
  );
}
