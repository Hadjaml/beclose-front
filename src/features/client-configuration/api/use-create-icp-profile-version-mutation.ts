"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createWorkspaceConfigurationApi, type IcpProfileCreateRequest } from "./workspace-configuration-api";

const workspaceConfigurationApi = createWorkspaceConfigurationApi(backendClient);

/** Second step of client provisioning: `POST /organizations/{id}/icp-profile`.
 * Invalidates only this workspace's configuration key — the smallest scope
 * that could now be stale. */
export function useCreateIcpProfileVersionMutation(workspaceId: WorkspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: IcpProfileCreateRequest) =>
      workspaceConfigurationApi.createIcpProfileVersion(workspaceId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "configuration"),
      });
    },
  });
}
