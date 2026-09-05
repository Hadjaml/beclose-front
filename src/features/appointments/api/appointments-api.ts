import type { WorkspaceId } from "@/shared/workspace/workspace";
import type { Appointment, SchedulingProcess } from "../model/appointment";

/** Read-side contract only. Calendar execution and mutations remain undefined. */
export interface AppointmentsApi {
  listAppointments(
    workspaceId: WorkspaceId,
    signal?: AbortSignal,
  ): Promise<readonly Appointment[]>;
  getAppointment(
    workspaceId: WorkspaceId,
    appointmentId: string,
    signal?: AbortSignal,
  ): Promise<Appointment>;
  getSchedulingProcess(
    workspaceId: WorkspaceId,
    schedulingProcessId: string,
    signal?: AbortSignal,
  ): Promise<SchedulingProcess>;
}
