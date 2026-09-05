import type { WorkspaceId } from "@/shared/workspace/workspace";

export type RealtimeConnectionStatus = "connected" | "connecting" | "disconnected" | "error";

export interface RealtimeEvent<TPayload = unknown> {
  id: string;
  type: string;
  workspaceId: WorkspaceId;
  occurredAt: string;
  payload: TPayload;
}

export interface RealtimeConnectionContext {
  workspaceId: WorkspaceId;
}

export type RealtimeUnsubscribe = () => void;

export interface RealtimeTransport {
  connect: (context: RealtimeConnectionContext) => Promise<void>;
  disconnect: () => Promise<void>;
  getStatus: () => RealtimeConnectionStatus;
  subscribe: <TPayload>(
    eventType: string,
    listener: (event: RealtimeEvent<TPayload>) => void,
  ) => RealtimeUnsubscribe;
}
