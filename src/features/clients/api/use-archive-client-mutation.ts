"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { globalKeys, workspaceKeys } from "@/shared/query/query-keys";
import { createClientsApi } from "./clients-api";

const clientsApi = createClientsApi(backendClient);

/** `POST /organizations/{id}/archive` — archiving, never deleting (a DELETE
 * would wipe opt-out/consent history, Beclose's own decision). Invalidates
 * the clients list and everything cached under this workspace: Gmail and
 * Telegram were just disconnected, its cached configuration/integration
 * status are stale. */
export function useArchiveClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) => clientsApi.archive(workspaceId),
    onSuccess: (_result, workspaceId) => {
      void queryClient.invalidateQueries({ queryKey: globalKeys.workspaces() });
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.scope(workspaceId) });
    },
  });
}
