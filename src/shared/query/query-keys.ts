import type { QueryKey } from "@tanstack/react-query";
import type { WorkspaceId } from "@/shared/workspace/workspace";

type KeyPart = Readonly<Record<string, unknown>> | string | number | boolean;

export const globalKeys = {
  all: ["global"] as const,
  session: () => [...globalKeys.all, "session"] as const,
  workspaces: () => [...globalKeys.all, "workspaces"] as const,
};

export const workspaceKeys = {
  all: ["workspace"] as const,
  scope: (workspaceId: WorkspaceId) => [...workspaceKeys.all, workspaceId] as const,
  feature: (workspaceId: WorkspaceId, feature: string) =>
    [...workspaceKeys.scope(workspaceId), feature] as const,
  list: (workspaceId: WorkspaceId, feature: string, parameters?: KeyPart): QueryKey => [
    ...workspaceKeys.feature(workspaceId, feature),
    "list",
    ...(parameters === undefined ? [] : [parameters]),
  ],
  detail: (workspaceId: WorkspaceId, feature: string, id: string) =>
    [...workspaceKeys.feature(workspaceId, feature), "detail", id] as const,
};
