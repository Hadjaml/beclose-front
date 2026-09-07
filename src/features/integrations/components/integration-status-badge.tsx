import {
  integrationConnectionStatusLabels,
  type IntegrationConnectionStatus,
} from "../model/integration";

const statusStyles = {
  NOT_CONNECTED: "bg-surface-muted text-text-secondary",
  CONNECTING: "bg-blue-50 text-blue-800",
  CONNECTED: "bg-emerald-50 text-emerald-800",
  NEEDS_ATTENTION: "bg-amber-50 text-amber-900",
  ERROR: "bg-red-50 text-red-800",
  DISCONNECTED: "bg-surface-muted text-text-secondary",
} as const satisfies Record<IntegrationConnectionStatus, string>;

export function IntegrationStatusBadge({
  status,
}: {
  status: IntegrationConnectionStatus;
}) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {integrationConnectionStatusLabels[status]}
    </span>
  );
}
