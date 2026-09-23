"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createWorkspaceConfigurationApi, type BantCriteriaCreateRequest } from "./workspace-configuration-api";

const workspaceConfigurationApi = createWorkspaceConfigurationApi(backendClient);

/** Third step of client provisioning: `POST /organizations/{id}/bant-criteria`.
 * Invalidates only this workspace's configuration key — the smallest scope
 * that could now be stale. */
export function useCreateBantCriteriaVersionMutation(workspaceId: WorkspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: BantCriteriaCreateRequest) =>
      workspaceConfigurationApi.createBantCriteriaVersion(workspaceId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "configuration"),
      });
    },
  });
}
