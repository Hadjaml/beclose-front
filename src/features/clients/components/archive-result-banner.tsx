import type { ArchiveResult } from "../api/clients-api";
import {
  describeGmailDisconnection,
  describeTelegramDisconnection,
  type DisconnectionReport,
} from "../model/archive-disconnections";

const outcomeStyles = {
  done: { mark: "✓", className: "text-emerald-800" },
  nothing: { mark: "–", className: "text-text-secondary" },
  "manual-check": { mark: "⚠", className: "font-medium text-amber-900" },
} as const;

function DisconnectionLine({ report }: { report: DisconnectionReport }) {
  const style = outcomeStyles[report.outcome];
  return (
    <li className={`flex gap-2 text-sm ${style.className}`}>
      <span aria-hidden="true">{style.mark}</span>
      <span>
        <span className="font-semibold">{report.label} :</span> {report.detail}
      </span>
    </li>
  );
}

/** Shows what archiving actually did on each external side — never just a
 * plain "OK": a `*_locally_only` status means a manual check is still owed. */
export function ArchiveResultBanner({
  result,
  onDismiss,
}: {
  result: ArchiveResult;
  onDismiss: () => void;
}) {
  const reports = [
    describeGmailDisconnection(result.disconnections.gmail),
    describeTelegramDisconnection(result.disconnections.telegram),
  ];
  const needsManualCheck = reports.some((report) => report.outcome === "manual-check");

  return (
    <div
      role="status"
      className={`space-y-3 rounded-app-lg border p-4 ${
        needsManualCheck ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-text-primary">
          « {result.client.name} » a été archivé
          {needsManualCheck ? " — une vérification manuelle est nécessaire" : ""}.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-sm font-semibold text-text-secondary hover:text-text-primary"
        >
          Fermer
        </button>
      </div>
      <ul className="space-y-1.5">
        {reports.map((report) => (
          <DisconnectionLine key={report.label} report={report} />
        ))}
      </ul>
      <p className="text-xs text-text-tertiary">
        L’historique (dont les désinscriptions) est conservé et le nom reste réservé.
      </p>
    </div>
  );
}
