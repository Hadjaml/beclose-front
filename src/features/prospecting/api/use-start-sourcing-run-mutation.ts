"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createSourcingRunsApi } from "./sourcing-runs-api";

const sourcingRunsApi = createSourcingRunsApi(backendClient);

/** No completion signal exists (fire-and-forget, `202 Accepted`) — the only
 * thing worth invalidating on success is the prospects list, so a run that
 * happens to finish fast enough is reflected on next refetch/interaction;
 * this does not poll or wait for new leads. */
export function useStartSourcingRunMutation(workspaceId: WorkspaceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sourcingRunsApi.start(workspaceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "lead-prospects"),
      });
    },
  });
}
