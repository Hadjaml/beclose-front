"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createSourcingRunsApi } from "./sourcing-runs-api";

const sourcingRunsApi = createSourcingRunsApi(backendClient);

/** A run lasts ~30 minutes — poll while at least one is `running`, stop as
 * soon as none is (no background traffic when idle). */
export const SOURCING_RUN_POLL_INTERVAL_MS = 10_000;

export function useSourcingRunsQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "sourcing-runs"),
    queryFn: ({ signal }) => sourcingRunsApi.list(workspaceId, signal),
    refetchInterval: (query) =>
      query.state.data?.some((run) => run.status === "running") === true
        ? SOURCING_RUN_POLL_INTERVAL_MS
        : false,
  });
}
