"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadProspectsApi, type LeadProspectsQuery } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

/** `refetchIntervalMs`: poll while a sourcing run is in progress (leads are
 * committed company by company as the run goes) — deliberately not part of
 * the query key, it changes when to refetch, not what is fetched. */
export function useLeadProspectsQuery(
  workspaceId: WorkspaceId,
  query: LeadProspectsQuery = {},
  options: { refetchIntervalMs?: number | false } = {},
) {
  return useQuery({
    queryKey: workspaceKeys.list(workspaceId, "lead-prospects", { ...query }),
    queryFn: ({ signal }) => leadProspectsApi.list(workspaceId, query, signal),
    // Keeps the current page's rows on screen while the next page loads
    // instead of flashing back to LoadingState on every "Suivant"/"Précédent".
    placeholderData: keepPreviousData,
    refetchInterval: options.refetchIntervalMs ?? false,
  });
}
