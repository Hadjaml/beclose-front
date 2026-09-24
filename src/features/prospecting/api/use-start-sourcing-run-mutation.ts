"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createSourcingRunsApi } from "./sourcing-runs-api";

const sourcingRunsApi = createSourcingRunsApi(backendClient);

/** Fire-and-forget (`202 Accepted`): on success the new run row already
 * exists (Beclose creates it before answering), so refresh the runs list
 * right away — that is what starts the polling while it runs — and the
 * prospects list. */
export function useStartSourcingRunMutation(workspaceId: WorkspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sourcingRunsApi.start(workspaceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "sourcing-runs"),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "lead-prospects"),
      });
    },
  });
}
