"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { KnownLeadOutcome } from "../model/lead-prospect";
import { createLeadProspectsApi } from "./lead-prospects-api";

const leadProspectsApi = createLeadProspectsApi(backendClient);

/** Declaring an outcome can change the lead's status (`won` → `converted`)
 * and always changes the precision figures — invalidate this workspace's
 * prospects (detail + lists) and its precision, nothing wider. */
export function useSetLeadOutcomeMutation(workspaceId: WorkspaceId, leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (outcome: KnownLeadOutcome) => leadProspectsApi.setOutcome(workspaceId, leadId, outcome),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "lead-prospects"),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.feature(workspaceId, "precision"),
      });
    },
  });
}
