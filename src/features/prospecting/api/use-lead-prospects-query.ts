"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadProspectsApi, type LeadProspectsQuery } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

export function useLeadProspectsQuery(workspaceId: WorkspaceId, query: LeadProspectsQuery = {}) {
  return useQuery({
    queryKey: workspaceKeys.list(workspaceId, "lead-prospects", { ...query }),
    queryFn: ({ signal }) => leadProspectsApi.list(workspaceId, query, signal),
  });
}
