"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createWorkspaceIntegrationStatusApi } from "./workspace-integration-status-api";

const workspaceIntegrationStatusApi = createWorkspaceIntegrationStatusApi(backendClient);

export function useWorkspaceIntegrationStatusQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "integration-status"),
    queryFn: ({ signal }) => workspaceIntegrationStatusApi.get(workspaceId, signal),
  });
}
