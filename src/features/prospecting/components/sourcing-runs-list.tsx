import {
  sourcingFunnel,
  sourcingRunDisplayStatus,
  sourcingRunStatusLabel,
  type SourcingRunDisplayStatus,
} from "../model/sourcing-run";
import type { SourcingRun } from "../schemas/sourcing-run-schema";

const statusBadgeClasses: Record<SourcingRunDisplayStatus, string> = {
  running: "bg-sky-100 text-sky-900",
  succeeded: "bg-emerald-100 text-emerald-900",
  failed: "bg-red-100 text-red-900",
  interrupted: "bg-amber-100 text-amber-900",
  unknown: "bg-surface-muted text-text-secondary",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function SourcingRunItem({ run }: { run: SourcingRun }) {
  const status = sourcingRunDisplayStatus(run);

  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClasses[status]}`}
        >
          {sourcingRunStatusLabel(run)}
        </span>
        <span className="text-sm text-text-primary">Lancé le {formatDateTime(run.startedAt)}</span>
        {run.finishedAt === null ? null : (
          <span className="text-sm text-text-secondary">
            · fini le {formatDateTime(run.finishedAt)}
          </span>
        )}
      </div>

      {status === "running" ? (
        <p className="text-sm text-text-secondary">
          Recherche en cours (environ 30 minutes) — les prospects arrivent au fil de l’eau dans la
          liste ci-dessous.
        </p>
      ) : null}

      {status === "failed" && run.errorMessage !== null ? (
        <p className="text-sm text-red-800">Cause : {run.errorMessage}</p>
      ) : null}
      {status === "interrupted" ? (
        <p className="text-sm text-amber-900">
          Le service a redémarré en plein run : il s’est arrêté avant la fin. Les prospects déjà
          trouvés sont conservés ; relancez un sourcing pour continuer.
        </p>
      ) : null}

      {run.report === null ? null : (
        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {sourcingFunnel(run.report).map((line) => (
            <div
              key={line.label}
              className={`flex items-baseline justify-between gap-3 text-sm ${
                line.nested === true ? "pl-4 text-text-secondary" : "font-medium text-text-primary"
              }`}
            >
              <dt>{line.label}</dt>
              <dd className="tabular-nums">{line.value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 text-sm font-medium text-text-primary sm:col-span-2">
            <dt>Taux de couverture e-mail</dt>
            <dd className="tabular-nums">{Math.round(run.report.emailCoverageRate * 100)} %</dd>
          </div>
        </dl>
      )}
    </li>
  );
}

/** Latest runs, most recent first — status and per-step breakdown. */
export function SourcingRunsList({ runs }: { runs: readonly SourcingRun[] }) {
  if (runs.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        Aucun sourcing lancé pour ce client pour l’instant.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
      {runs.map((run) => (
        <SourcingRunItem key={run.id} run={run} />
      ))}
    </ul>
  );
}
