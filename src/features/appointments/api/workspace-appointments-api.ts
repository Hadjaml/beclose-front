import type { ApiClient } from "@/shared/api/api-client";
import { paginatedEnvelopeSchema, type Pagination } from "@/shared/api/api-envelope";
import type { WorkspaceId } from "@/shared/workspace/workspace";
import {
  workspaceAppointmentSchema,
  type appointmentStatusValues,
} from "../schemas/workspace-appointment-schema";
import type { WorkspaceAppointment } from "../model/workspace-appointment";

const MAX_PAGE = 200;

export interface WorkspaceAppointmentsPage {
  data: readonly WorkspaceAppointment[];
  pagination: Pagination;
}

export interface WorkspaceAppointmentsQuery {
  /** Sent as-is; defaults to `confirmed` — without a filter Beclose also
   * returns the proposed/cancelled slots of a negotiation. */
  status?: (typeof appointmentStatusValues)[number];
}

export interface WorkspaceAppointmentsApi {
  list: (
    workspaceId: WorkspaceId,
    query?: WorkspaceAppointmentsQuery,
    signal?: AbortSignal,
  ) => Promise<WorkspaceAppointmentsPage>;
}

const appointmentsResponseSchema = paginatedEnvelopeSchema(workspaceAppointmentSchema);

export function createWorkspaceAppointmentsApi(client: ApiClient): WorkspaceAppointmentsApi {
  return {
    list(workspaceId, query, signal) {
      return client.request(`/organizations/${workspaceId}/appointments`, {
        method: "GET",
        context: { workspaceId },
        schema: appointmentsResponseSchema,
        query: { status: query?.status ?? "confirmed", limit: MAX_PAGE },
        ...(signal === undefined ? {} : { signal }),
      });
    },
  };
}
