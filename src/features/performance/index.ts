export type { PerformanceApi } from "./api/performance-api";
export { PerformanceBreakdownTable } from "./components/performance-breakdown-table";
export { PerformanceFunnel } from "./components/performance-funnel";
export { PerformanceInsightCard } from "./components/performance-insight";
export { PerformanceMetricCard } from "./components/performance-metric-card";
export {
  backofficePerformanceVisibility,
  PerformanceView,
  portalPerformanceVisibility,
  type PerformanceVisibility,
} from "./components/performance-view";
export type {
  BreakdownDimension,
  FunnelStage,
  MetricKind,
  PerformanceBreakdown,
  PerformanceInsight,
  PerformanceMetric,
  WorkspacePerformance,
} from "./model/performance";
export {
  breakdownDimensionSchema,
  funnelStageSchema,
  metricComparisonSchema,
  metricKindSchema,
  performanceBreakdownSchema,
  performanceInsightSchema,
  performanceMetricSchema,
  workspacePerformanceSchema,
} from "./schemas/performance-schemas";

// Real, read-only endpoints (Beclose, 24/09/2026) — no single "precision" figure.
export {
  createWorkspacePerformanceApi,
  type WorkspacePerformanceApi,
} from "./api/workspace-performance-api";
export {
  useApprovalMetricsQuery,
  usePrecisionQuery,
} from "./api/use-workspace-performance-queries";
export { ApprovalMetricsView } from "./components/approval-metrics-view";
export { PrecisionView } from "./components/precision-view";
export { WorkspacePerformanceSection } from "./components/workspace-performance-section";
export { approvalMetricsSchema, type ApprovalMetrics } from "./schemas/approval-metrics-schema";
export { precisionSchema, type Precision } from "./schemas/precision-schema";
