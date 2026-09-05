import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { WorkspaceIntegrations } from "../model/integration";

export interface IntegrationsApi {
  getWorkspaceIntegrations(workspaceId: WorkspaceId): Promise<WorkspaceIntegrations>;
}
