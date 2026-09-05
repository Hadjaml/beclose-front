import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { WorkspacePerformance } from "../model/performance";

/** Read-side port only. Metrics, comparisons and insights are backend-owned. */
export interface PerformanceApi {
  getWorkspacePerformance(
    workspaceId: WorkspaceId,
    signal?: AbortSignal,
  ): Promise<WorkspacePerformance>;
}
