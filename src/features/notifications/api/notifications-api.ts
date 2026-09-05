import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Notification } from "../model/notification";

export interface NotificationsApi {
  listNotifications(workspaceId?: WorkspaceId): Promise<readonly Notification[]>;
}
