"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadPipelineApi } from "./lead-pipeline-api";

const leadPipelineApi = createLeadPipelineApi(backendClient);

export function useLeadPipelineQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "lead-pipeline"),
    queryFn: ({ signal }) => leadPipelineApi.getOverview(workspaceId, signal),
  });
}
