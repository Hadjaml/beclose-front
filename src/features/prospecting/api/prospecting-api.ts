import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Prospect } from "../model/prospecting";

/**
 * Read-side consumer port for a future backend adapter. Mutations and batch
 * operations remain undefined until the backend contract exists.
 */
export interface ProspectingApi {
  listProspects(workspaceId: WorkspaceId, signal?: AbortSignal): Promise<readonly Prospect[]>;
  getProspect(
    workspaceId: WorkspaceId,
    prospectId: string,
    signal?: AbortSignal,
  ): Promise<Prospect>;
}
