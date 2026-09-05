import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Approval } from "../model/approval";

export interface ApprovalsApi {
  listApprovals(workspaceId: WorkspaceId): Promise<readonly Approval[]>;
  getApproval(workspaceId: WorkspaceId, approvalId: string): Promise<Approval>;
}
