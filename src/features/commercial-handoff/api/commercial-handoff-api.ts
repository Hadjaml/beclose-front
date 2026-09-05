import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { CommercialBrief } from "../model/commercial-handoff";

/** Read-side consumer port. Brief generation and assignment remain backend-owned. */
export interface CommercialHandoffApi {
  getBrief(
    workspaceId: WorkspaceId,
    appointmentId: string,
    signal?: AbortSignal,
  ): Promise<CommercialBrief>;
}
