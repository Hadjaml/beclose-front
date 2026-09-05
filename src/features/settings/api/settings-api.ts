import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Settings } from "../model/settings";

export interface SettingsApi {
  getBackofficeSettings(): Promise<Settings>;
  getPortalSettings(workspaceId: WorkspaceId): Promise<Settings>;
}
