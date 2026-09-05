import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { OutreachSequence } from "../model/outreach";

/** Read-side consumer port. Execution and timing remain entirely backend-owned. */
export interface OutreachApi {
  getSequence(
    workspaceId: WorkspaceId,
    sequenceId: string,
    signal?: AbortSignal,
  ): Promise<OutreachSequence>;
}
