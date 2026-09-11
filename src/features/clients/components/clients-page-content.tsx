"use client";

import { ErrorState, LoadingState } from "@/shared/ui/states";
import { useClientsQuery } from "../api/use-clients-query";
import { ClientsList } from "./clients-list";

export function ClientsPageContent() {
  const query = useClientsQuery();

  if (query.isPending) return <LoadingState label="Chargement des clients…" />;
  if (query.isError) {
    return (
      <ErrorState
        title="Impossible de charger les clients"
        onRetry={() => void query.refetch()}
      />
    );
  }
  return <ClientsList clients={query.data} />;
}
