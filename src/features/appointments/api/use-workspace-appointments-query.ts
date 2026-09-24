"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { workspaceKeys } from "@/shared/query/query-keys";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import {
  createWorkspaceAppointmentsApi,
  type WorkspaceAppointmentsQuery,
} from "./workspace-appointments-api";

const workspaceAppointmentsApi = createWorkspaceAppointmentsApi(backendClient);

export function useWorkspaceAppointmentsQuery(
  workspaceId: WorkspaceId,
  query: WorkspaceAppointmentsQuery = {},
) {
  return useQuery({
    queryKey: workspaceKeys.list(workspaceId, "appointments", { status: query.status ?? "confirmed" }),
    queryFn: ({ signal }) => workspaceAppointmentsApi.list(workspaceId, query, signal),
  });
}
