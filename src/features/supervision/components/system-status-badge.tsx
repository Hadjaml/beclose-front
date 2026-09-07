import {
  systemStatusLabels,
  type SystemStatus,
} from "../model/supervision";

interface SystemStatusBadgeProps {
  status: SystemStatus;
}

export function SystemStatusBadge({ status }: SystemStatusBadgeProps) {
  const tone =
    status === "ERROR"
      ? "bg-red-50 text-red-800"
      : status === "NEEDS_ATTENTION"
        ? "bg-amber-50 text-amber-900"
        : status === "ACTIVE"
          ? "bg-emerald-50 text-emerald-800"
          : "bg-surface-muted text-text-secondary";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>
      {systemStatusLabels[status]}
    </span>
  );
}
