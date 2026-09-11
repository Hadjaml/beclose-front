import type { Pagination } from "@/shared/api/api-envelope";
import type { ApiClient } from "@/shared/api/api-client";
import { paginatedEnvelopeSchema } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import { messageLogEntrySchema } from "../schemas/message-log-schema";
import type { MessageLogEntry } from "../model/message-log";

export interface MessageLogPage {
  data: readonly MessageLogEntry[];
  pagination: Pagination;
}

export interface MessageLogQuery {
  leadId?: string;
  limit?: number;
  offset?: number;
}

export interface MessageLogApi {
  list: (
    workspaceId: WorkspaceId,
    query?: MessageLogQuery,
    signal?: AbortSignal,
  ) => Promise<MessageLogPage>;
}

const messagesResponseSchema = paginatedEnvelopeSchema(messageLogEntrySchema);

export function createMessageLogApi(client: ApiClient): MessageLogApi {
  return {
    async list(workspaceId, query, signal) {
      return client.request(`/organizations/${workspaceId}/messages`, {
        method: "GET",
        context: { workspaceId },
        schema: messagesResponseSchema,
        query: {
          leadId: query?.leadId,
          limit: query?.limit,
          offset: query?.offset,
        },
        ...(signal === undefined ? {} : { signal }),
      });
    },
  };
}
