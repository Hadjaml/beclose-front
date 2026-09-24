"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { globalKeys } from "@/shared/query/query-keys";
import { createClientsApi } from "./clients-api";

const clientsApi = createClientsApi(backendClient);

/** Clients are a global (not workspace-scoped) resource — `globalKeys.workspaces()`.
 * `includeArchived` is part of the key (a distinct cached list, archived
 * organizations are hidden by default on Beclose's side) but stays under the
 * same `globalKeys.workspaces()` prefix, so one invalidation covers both. */
export function useClientsQuery(options: { includeArchived?: boolean } = {}) {
  const includeArchived = options.includeArchived === true;
  return useQuery({
    queryKey: [...globalKeys.workspaces(), { includeArchived }],
    queryFn: ({ signal }) => clientsApi.list({ includeArchived }, signal),
  });
}
