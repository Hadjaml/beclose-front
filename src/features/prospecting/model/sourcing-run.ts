import type { SourcingReport, SourcingRun } from "../schemas/sourcing-run-schema";

export type SourcingRunDisplayStatus = "running" | "succeeded" | "failed" | "interrupted";

/** A run killed by a service restart is stored as `failed` with the message
 * "interrompu" (Beclose marks leftover `running` rows at API startup) —
 * shown apart from a genuine failure since nothing went wrong in the run
 * itself. */
export function sourcingRunDisplayStatus(run: SourcingRun): SourcingRunDisplayStatus {
  if (run.status === "failed" && /interrompu/i.test(run.errorMessage ?? "")) return "interrupted";
  return run.status;
}

export const sourcingRunStatusLabels: Record<SourcingRunDisplayStatus, string> = {
  running: "En cours",
  succeeded: "Terminé",
  failed: "Échoué",
  interrupted: "Interrompu",
};

export interface SourcingFunnelLine {
  label: string;
  value: number;
  /** Indented "of which" line. */
  nested?: boolean;
}

/**
 * The per-step breakdown that answers "why so few leads", every figure
 * exactly as Beclose reports it (no arithmetic here — an earlier version
 * derived "sans site"/"sans e-mail" by subtraction; Beclose now sends both
 * explicitly). `companiesFailed` (an error on one specific company) is in
 * neither "sans site" nor "sans e-mail": we do not know which it was. The
 * two "sans …" lines are simply left out of a report written before those
 * counters existed, rather than guessed.
 */
export function sourcingFunnel(report: SourcingReport): SourcingFunnelLine[] {
  const lines: SourcingFunnelLine[] = [
    { label: "Déjà en base (ignorées)", value: report.companiesSkippedExisting },
    { label: "Exclues par l’effectif (hors ICP)", value: report.companiesExcludedByHeadcount },
    { label: "Nouvelles entreprises traitées", value: report.companiesFound },
    { label: "en échec de traitement", value: report.companiesFailed, nested: true },
  ];
  if (report.companiesWithoutDomain !== null) {
    lines.push({
      label: "sans site officiel trouvé",
      value: report.companiesWithoutDomain,
      nested: true,
    });
  }
  lines.push({ label: "avec site officiel", value: report.companiesWithDomain, nested: true });
  if (report.companiesWithoutEmail !== null) {
    lines.push({
      label: "site trouvé, mais aucun e-mail exploitable",
      value: report.companiesWithoutEmail,
      nested: true,
    });
  }
  lines.push({ label: "Avec e-mail exploitable (leads)", value: report.companiesWithEmail });
  return lines;
}
