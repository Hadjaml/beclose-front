"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadProspectsApi } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

/** Retrying a failed qualification changes the message's evaluation status
 * and, within a minute, the prospect's evaluation — invalidate this
 * workspace's message log and prospects, nothing wider. */
export function useRequestReevaluationMutation(workspaceId: WorkspaceId, leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leadProspectsApi.requestReevaluation(workspaceId, leadId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.feature(workspaceId, "message-log") });
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.feature(workspaceId, "lead-prospects") });
    },
  });
}
