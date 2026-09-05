import type { z } from "zod";
import type {
  approvalDecisionOptionSchema,
  approvalDeliveryChannelSchema,
  approvalDeliverySchema,
  approvalDeliveryStatusSchema,
  approvalDomainSchema,
  approvalSchema,
  approvalStatusSchema,
  approvalTypeSchema,
} from "../schemas/approval-schemas";

export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;
export type ApprovalDomain = z.infer<typeof approvalDomainSchema>;
export type ApprovalType = z.infer<typeof approvalTypeSchema>;
export type ApprovalDeliveryChannel = z.infer<typeof approvalDeliveryChannelSchema>;
export type ApprovalDeliveryStatus = z.infer<typeof approvalDeliveryStatusSchema>;
export type ApprovalDecisionOption = z.infer<typeof approvalDecisionOptionSchema>;
export type ApprovalDelivery = z.infer<typeof approvalDeliverySchema>;
export type Approval = z.infer<typeof approvalSchema>;

export const approvalStatusLabels = {
  PENDING: "À valider",
  APPROVED: "Validée",
  MODIFIED: "Modifiée",
  REJECTED: "Refusée",
  EXPIRED: "Expirée",
  CANCELED: "Annulée",
} as const satisfies Record<ApprovalStatus, string>;

export const approvalDeliveryChannelLabels = {
  PORTAL: "Portail Bewise",
  CRM: "CRM",
  SLACK: "Slack",
  TEAMS: "Teams",
  EMAIL: "E-mail",
  OTHER: "Autre outil",
} as const satisfies Record<ApprovalDeliveryChannel, string>;

export const approvalDeliveryStatusLabels = {
  PENDING: "En attente",
  DELIVERED: "Livrée",
  ACKNOWLEDGED: "Traitée",
  FAILED: "Échec",
} as const satisfies Record<ApprovalDeliveryStatus, string>;
