"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadProspectsApi } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

export function useLeadProspectDetailQuery(workspaceId: WorkspaceId, leadId: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(workspaceId, "lead-prospects", leadId),
    queryFn: ({ signal }) => leadProspectsApi.getDetail(workspaceId, leadId, signal),
  });
}
