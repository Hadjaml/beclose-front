import { z } from "zod";
import { tolerantEnum } from "@/shared/schemas/tolerant-enum";

/**
 * Real `GET /organizations/{id}/appointments` (`AppointmentOut`, Beclose,
 * 24/09/2026). Separate from the speculative `appointment-schemas.ts` (a
 * richer target model no backend provides) — per the repo convention, the
 * real shape sits next to it rather than being forced into it.
 */
export const appointmentStatusValues = ["proposed", "confirmed", "cancelled", "completed"] as const;
/** Tolerant: Beclose owns the vocabulary (transverse rule). */
export const workspaceAppointmentStatusSchema = tolerantEnum(appointmentStatusValues);

/** Only what the list shows of the company/contact (same shapes as
 * `/prospects`, which carries more): kept minimal here so this feature does
 * not depend on `prospecting` internals. */
const appointmentCompanySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});
const appointmentContactSchema = z.object({
  fullName: z.string().trim().min(1).nullable(),
  email: z.string().trim().min(1),
  role: z.string().trim().min(1).nullable(),
});

export const workspaceAppointmentSchema = z.object({
  id: z.string().trim().min(1),
  scheduledAt: z.string(),
  status: workspaceAppointmentStatusSchema,
  externalEventId: z.string().nullable(),
  /** Google Calendar link; `null` for a slot that is not confirmed and for
   * appointments confirmed before the field existed. */
  eventUrl: z.string().nullable(),
  leadId: z.string().trim().min(1),
  company: appointmentCompanySchema,
  contact: appointmentContactSchema,
});
