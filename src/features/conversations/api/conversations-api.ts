import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Conversation } from "../model/conversation";

/** Read-side consumer port. Mutations wait for an authoritative backend contract. */
export interface ConversationsApi {
  listConversations(
    workspaceId: WorkspaceId,
    signal?: AbortSignal,
  ): Promise<readonly Conversation[]>;
  getConversation(
    workspaceId: WorkspaceId,
    conversationId: string,
    signal?: AbortSignal,
  ): Promise<Conversation>;
}
