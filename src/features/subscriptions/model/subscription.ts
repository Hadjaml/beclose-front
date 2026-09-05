import type { z } from "zod";
import type {
  billingFrequencySchema,
  invoiceSchema,
  invoiceStatusSchema,
  subscriptionActionSchema,
  subscriptionPlanSchema,
  subscriptionSchema,
  subscriptionStatusSchema,
  subscriptionUsageSchema,
  usageAttentionSchema,
} from "../schemas/subscription-schemas";

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type BillingFrequency = z.infer<typeof billingFrequencySchema>;
export type UsageAttention = z.infer<typeof usageAttentionSchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type SubscriptionUsage = z.infer<typeof subscriptionUsageSchema>;
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
export type SubscriptionAction = z.infer<typeof subscriptionActionSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;

export const subscriptionStatusLabels = {
  TRIAL: "Essai",
  ACTIVE: "Actif",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
  SUSPENDED: "Suspendu",
  ENDED: "Terminé",
} as const satisfies Record<SubscriptionStatus, string>;

export const billingFrequencyLabels = {
  MONTHLY: "Mensuelle",
  QUARTERLY: "Trimestrielle",
  YEARLY: "Annuelle",
  CUSTOM: "Personnalisée",
} as const satisfies Record<BillingFrequency, string>;

export const invoiceStatusLabels = {
  DRAFT: "Brouillon",
  OPEN: "À régler",
  PAID: "Payée",
  PAST_DUE: "En retard",
  VOID: "Annulée",
  UNCOLLECTIBLE: "Irrécouvrable",
} as const satisfies Record<InvoiceStatus, string>;

export const usageAttentionLabels = {
  NONE: "Normal",
  APPROACHING_LIMIT: "Limite proche",
  LIMIT_REACHED: "Limite atteinte",
  OVER_LIMIT: "Dépassement",
} as const satisfies Record<UsageAttention, string>;
