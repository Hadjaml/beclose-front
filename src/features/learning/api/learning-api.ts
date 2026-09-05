import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { LearningOverview } from "../model/learning";

/** Consumer-side port only; the future backend adapter will define transport details. */
export interface LearningApi {
  getOverview(workspaceId: WorkspaceId, signal?: AbortSignal): Promise<LearningOverview>;
}
