import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();
const optionalTimestamp = z.string().datetime({ offset: true }).optional();

export const subscriptionStatusSchema = z.enum([
  "TRIAL",
  "ACTIVE",
  "PAST_DUE",
  "CANCELED",
  "SUSPENDED",
  "ENDED",
]);

export const billingFrequencySchema = z.enum([
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "CUSTOM",
]);

export const usageAttentionSchema = z.enum([
  "NONE",
  "APPROACHING_LIMIT",
  "LIMIT_REACHED",
  "OVER_LIMIT",
]);

export const moneySchema = z.object({
  amount: z.number(),
  currency: z.string().trim().min(3),
  formattedAmount: optionalText,
});

export const subscriptionPeriodSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
});

export const planEntitlementSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: optionalText,
  enabled: z.boolean(),
});

export const planLimitSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  limit: z.number().nonnegative().optional(),
  formattedLimit: optionalText,
});

export const subscriptionPlanSchema = z.object({
  id: z.string().trim().min(1),
  code: optionalText,
  commercialName: z.string().trim().min(1),
  description: optionalText,
  entitlements: z.array(planEntitlementSchema),
  limits: z.array(planLimitSchema),
});

export const subscriptionUsageSchema = z.object({
  key: z.string().trim().min(1),
  unit: z.string().trim().min(1),
  label: z.string().trim().min(1),
  consumed: z.number().nonnegative(),
  formattedConsumed: optionalText,
  limit: z.number().nonnegative().optional(),
  formattedLimit: optionalText,
  period: subscriptionPeriodSchema,
  attention: usageAttentionSchema.optional(),
  overage: moneySchema.optional(),
});

export const paymentSummarySchema = z.object({
  label: z.string().trim().min(1),
  brand: optionalText,
  lastFour: z.string().trim().length(4).optional(),
  expiresMonth: z.number().int().min(1).max(12).optional(),
  expiresYear: z.number().int().optional(),
});

export const invoiceStatusSchema = z.enum([
  "DRAFT",
  "OPEN",
  "PAID",
  "PAST_DUE",
  "VOID",
  "UNCOLLECTIBLE",
]);

export const invoiceSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  number: optionalText,
  amount: moneySchema,
  issuedAt: optionalTimestamp,
  dueAt: optionalTimestamp,
  status: invoiceStatusSchema,
  documentUrl: z.url().optional(),
  paymentReference: optionalText,
  paidAt: optionalTimestamp,
});

export const subscriptionActionSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  kind: z.enum([
    "VIEW_INVOICE",
    "UPDATE_PAYMENT_METHOD",
    "CHANGE_PLAN",
    "CANCEL",
    "REACTIVATE",
    "OTHER",
  ]),
  resourceId: optionalText,
});

export const subscriptionHistoryEntrySchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  occurredAt: z.string().datetime({ offset: true }),
  summary: optionalText,
});

export const subscriptionSchema = z.object({
  id: z.string().trim().min(1),
  workspaceId: workspaceIdSchema,
  workspaceName: optionalText,
  plan: subscriptionPlanSchema,
  status: subscriptionStatusSchema,
  startedAt: optionalTimestamp,
  currentPeriod: subscriptionPeriodSchema.optional(),
  renewsAt: optionalTimestamp,
  canceledAt: optionalTimestamp,
  endsAt: optionalTimestamp,
  trialPeriod: subscriptionPeriodSchema.optional(),
  price: moneySchema.optional(),
  billingFrequency: billingFrequencySchema.optional(),
  usage: z.array(subscriptionUsageSchema),
  paymentSummary: paymentSummarySchema.optional(),
  nextBillingAt: optionalTimestamp,
  invoices: z.array(invoiceSchema),
  actions: z.array(subscriptionActionSchema),
  history: z.array(subscriptionHistoryEntrySchema).optional(),
});

export const subscriptionListSchema = z.array(subscriptionSchema);
