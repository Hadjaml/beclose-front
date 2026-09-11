"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { createMessageLogApi, type MessageLogQuery } from "./message-log-api";

const messageLogApi = createMessageLogApi(backendClient);

export function useMessageLogQuery(workspaceId: WorkspaceId, query: MessageLogQuery = {}) {
  return useQuery({
    queryKey: workspaceKeys.list(workspaceId, "message-log", { ...query }),
    queryFn: ({ signal }) => messageLogApi.list(workspaceId, query, signal),
  });
}
