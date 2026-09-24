"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createWorkspacePerformanceApi } from "./workspace-performance-api";

const workspacePerformanceApi = createWorkspacePerformanceApi(backendClient);

/** Key feature name `"precision"` is also what declaring an outcome on a
 * prospect invalidates. */
export function usePrecisionQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "precision"),
    queryFn: ({ signal }) => workspacePerformanceApi.getPrecision(workspaceId, signal),
  });
}

export function useApprovalMetricsQuery(workspaceId: WorkspaceId) {
  return useQuery({
    queryKey: workspaceKeys.feature(workspaceId, "approval-metrics"),
    queryFn: ({ signal }) => workspacePerformanceApi.getApprovalMetrics(workspaceId, signal),
  });
}
