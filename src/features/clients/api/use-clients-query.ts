"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { globalKeys } from "@/shared/query/query-keys";
import { createClientsApi } from "./clients-api";

const clientsApi = createClientsApi(backendClient);

/** Clients are a global (not workspace-scoped) resource — `globalKeys.workspaces()`. */
export function useClientsQuery() {
  return useQuery({
    queryKey: globalKeys.workspaces(),
    queryFn: ({ signal }) => clientsApi.list(signal),
  });
}
