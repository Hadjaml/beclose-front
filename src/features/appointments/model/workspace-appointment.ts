import type { z } from "zod";
import { describeEnumValue } from "@/shared/schemas/tolerant-enum";
import type {
  appointmentStatusValues,
  workspaceAppointmentSchema,
  workspaceAppointmentStatusSchema,
} from "../schemas/workspace-appointment-schema";

export type WorkspaceAppointment = z.infer<typeof workspaceAppointmentSchema>;
export type WorkspaceAppointmentStatus = z.infer<typeof workspaceAppointmentStatusSchema>;

export const workspaceAppointmentStatusLabels = {
  proposed: "Créneau proposé",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
} as const satisfies Record<(typeof appointmentStatusValues)[number], string>;

/** Never throws on a status added by Beclose later. */
export function workspaceAppointmentStatusLabel(status: WorkspaceAppointmentStatus): string {
  return describeEnumValue(workspaceAppointmentStatusLabels, status);
}

/** A calendar link is only ever opened if it is a plain http(s) URL. */
export function safeCalendarUrl(url: string | null): string | null {
  if (url === null) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}
