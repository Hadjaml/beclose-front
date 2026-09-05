import type { Prospect } from "@/features/prospecting";
import type { z } from "zod";
import type {
  appointmentListSchema,
  appointmentOriginSchema,
  appointmentSchema,
  appointmentStatusSchema,
  crmSyncStatusSchema,
  schedulingProcessSchema,
  schedulingStatusSchema,
} from "../schemas/appointment-schemas";

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
export type AppointmentOrigin = z.infer<typeof appointmentOriginSchema>;
export type CrmSyncStatus = z.infer<typeof crmSyncStatusSchema>;
export type SchedulingStatus = z.infer<typeof schedulingStatusSchema>;
export type SchedulingProcess = z.infer<typeof schedulingProcessSchema>;
export type Appointment = z.infer<typeof appointmentSchema>;
export type AppointmentList = z.infer<typeof appointmentListSchema>;

export interface AppointmentListItem {
  appointment: Appointment;
  prospect: Prospect;
}

export const appointmentStatusLabels = {
  PROPOSED: "Proposé",
  PENDING_CONFIRMATION: "À confirmer",
  BOOKED: "Réservé",
  RESCHEDULE_REQUESTED: "Report demandé",
  CANCELED: "Annulé",
  COMPLETED: "Terminé",
  NO_SHOW: "Absent",
} as const satisfies Record<AppointmentStatus, string>;

export const appointmentOriginLabels = {
  SYSTEM_AUTOMATIC: "Pris par le système",
  HUMAN_ASSISTED: "Avec intervention humaine",
  MANUAL: "Créé manuellement",
  EXTERNAL_IMPORT: "Importé",
} as const satisfies Record<AppointmentOrigin, string>;

export const crmSyncStatusLabels = {
  NOT_SYNCED: "Non synchronisé",
  SYNCED: "Synchronisé",
  ATTENTION: "Attention",
  ERROR: "Erreur",
} as const satisfies Record<CrmSyncStatus, string>;

export const schedulingStatusLabels = {
  RECOMMENDED: "Rendez-vous recommandé",
  PROPOSAL_IN_PROGRESS: "Proposition en cours",
  SLOTS_AVAILABLE: "Créneaux disponibles",
  SLOT_SELECTED: "Créneau choisi",
  PENDING_CONFIRMATION: "Confirmation en attente",
  CONFIRMED: "Confirmé",
  RESCHEDULE_REQUESTED: "Report demandé",
  CANCELED: "Annulé",
} as const satisfies Record<SchedulingStatus, string>;
