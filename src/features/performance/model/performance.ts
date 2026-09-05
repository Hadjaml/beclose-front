import type { z } from "zod";
import type {
  breakdownDimensionSchema,
  funnelStageSchema,
  metricKindSchema,
  performanceBreakdownSchema,
  performanceInsightSchema,
  performanceMetricSchema,
  workspacePerformanceSchema,
} from "../schemas/performance-schemas";

export type MetricKind = z.infer<typeof metricKindSchema>;
export type PerformanceMetric = z.infer<typeof performanceMetricSchema>;
export type FunnelStage = z.infer<typeof funnelStageSchema>;
export type BreakdownDimension = z.infer<typeof breakdownDimensionSchema>;
export type PerformanceBreakdown = z.infer<typeof performanceBreakdownSchema>;
export type PerformanceInsight = z.infer<typeof performanceInsightSchema>;
export type WorkspacePerformance = z.infer<typeof workspacePerformanceSchema>;
