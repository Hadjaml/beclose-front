import type { WorkspaceId } from "@/shared/workspace/workspace";
import type {
  GlobalSupervision,
  WorkspaceSupervision,
} from "../model/supervision";

/** Read-side ports only. Statuses, priorities, actions and summaries are backend-owned. */
export interface SupervisionApi {
  getGlobalOverview(signal?: AbortSignal): Promise<GlobalSupervision>;
  getWorkspaceOverview(
    workspaceId: WorkspaceId,
    signal?: AbortSignal,
  ): Promise<WorkspaceSupervision>;
}
