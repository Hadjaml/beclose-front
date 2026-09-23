"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { globalKeys, workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createClientsApi, type OrganizationUpdateValue } from "./clients-api";

const clientsApi = createClientsApi(backendClient);

/** `PATCH /organizations/{id}` — fixing a field left blank (or wrong) at
 * onboarding, e.g. `telegramChatId` from the Connections step. Invalidates
 * the clients list (name/pitch could change there) and this workspace's
 * configuration (also shows name/telegramChatId) — the smallest scopes
 * that could now be stale. */
export function useUpdateClientMutation(workspaceId: WorkspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: OrganizationUpdateValue) => clientsApi.update(workspaceId, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: globalKeys.workspaces() });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "configuration"),
      });
    },
  });
}
