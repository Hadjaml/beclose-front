"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createLeadProspectsApi } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

/** Requesting a regeneration flips the prospect's `draftRegeneration` state
 * and, within a minute, adds a pending draft to its messages — invalidate
 * this workspace's prospects and message log, nothing wider. */
export function useRequestDraftRegenerationMutation(workspaceId: WorkspaceId, leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leadProspectsApi.requestDraftRegeneration(workspaceId, leadId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.feature(workspaceId, "lead-prospects") });
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.feature(workspaceId, "message-log") });
    },
  });
}
