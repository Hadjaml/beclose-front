import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Subscription } from "../model/subscription";

export interface SubscriptionsApi {
  listSubscriptions(): Promise<readonly Subscription[]>;
  getWorkspaceSubscription(workspaceId: WorkspaceId): Promise<Subscription | null>;
}
