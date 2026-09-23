"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { backendClient } from "@/shared/api/backend-client";
import { globalKeys } from "@/shared/query/query-keys";
import { createClientsApi } from "./clients-api";
import type { OrganizationCreateValue } from "../schemas/organization-create-schema";

const clientsApi = createClientsApi(backendClient);

/** First step of client provisioning: `POST /organizations`. Invalidates
 * only the clients list (`globalKeys.workspaces()`) — the smallest scope
 * that could now be stale, per `AGENTS.md`. */
export function useCreateClientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: OrganizationCreateValue) => clientsApi.create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: globalKeys.workspaces() });
    },
  });
}
