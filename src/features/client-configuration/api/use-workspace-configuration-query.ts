"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createWorkspaceConfigurationApi } from "./workspace-configuration-api";

const workspaceConfigurationApi = createWorkspaceConfigurationApi(backendClient);

export function useWorkspaceConfigurationQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "configuration"),
    queryFn: ({ signal }) => workspaceConfigurationApi.get(workspaceId, signal),
  });
}
