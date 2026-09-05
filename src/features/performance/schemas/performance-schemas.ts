import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();

export const metricKindSchema = z.enum(["VOLUME", "RATE", "DURATION", "VALUE"]);

export const metricComparisonSchema = z.object({
  previousValue: z.number().optional(),
  formattedPreviousValue: optionalText,
  change: z.number().optional(),
  formattedChange: optionalText,
  direction: z.enum(["UP", "DOWN", "UNCHANGED"]).optional(),
  interpretation: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).optional(),
});

export const performanceMetricSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  kind: metricKindSchema,
  value: z.number().optional(),
  formattedValue: optionalText,
  comparison: metricComparisonSchema.optional(),
  description: optionalText,
});

export const funnelStageSchema = z.object({
  stage: z.enum([
    "SOURCED",
    "APPROVED",
    "CONTACTED",
    "RESPONSES",
    "QUALIFIED",
    "APPOINTMENTS",
    "OPPORTUNITIES",
    "CUSTOMERS",
  ]),
  label: z.string().trim().min(1),
  metric: performanceMetricSchema,
});

export const breakdownDimensionSchema = z.enum([
  "CHANNEL",
  "SEGMENT",
  "INDUSTRY",
  "COMPANY_SIZE",
  "PERSONA",
  "STRATEGY",
  "PERIOD",
]);

export const performanceBreakdownSchema = z.object({
  id: z.string().trim().min(1),
  dimension: breakdownDimensionSchema,
  label: z.string().trim().min(1),
  rows: z.array(
    z.object({
      id: z.string().trim().min(1),
      label: z.string().trim().min(1),
      metrics: z.array(performanceMetricSchema),
    }),
  ),
});

export const performanceInsightSchema = z.object({
  id: z.string().trim().min(1),
  observation: z.string().trim().min(1),
  impact: optionalText,
  recommendation: optionalText,
  confidence: z.number().min(0).max(1).optional(),
  formattedConfidence: optionalText,
  proposedAction: z
    .object({
      label: z.string().trim().min(1),
      href: optionalText,
    })
    .optional(),
});

export const performancePeriodSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  timezone: z.string().trim().min(1),
  label: optionalText,
});

export const workspacePerformanceSchema = z.object({
  workspaceId: workspaceIdSchema,
  period: performancePeriodSchema,
  metrics: z.array(performanceMetricSchema),
  funnel: z.array(funnelStageSchema),
  breakdowns: z.array(performanceBreakdownSchema),
  insights: z.array(performanceInsightSchema),
});
