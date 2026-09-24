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
  /** Indented "of which" line, derived rather than reported. */
  derived?: boolean;
}

/**
 * The per-step breakdown that answers "why so few leads". `companiesFound`
 * counts only NEW companies actually processed (already-known and
 * headcount-excluded ones are counted apart, before that point); of those,
 * the ones that raised an error stop before the site lookup. The two
 * "sans …" lines are derived from Beclose's counters, not reported by it —
 * clamped at 0 so an odd report can never show a negative number.
 */
export function sourcingFunnel(report: SourcingReport): SourcingFunnelLine[] {
  const withoutSite = Math.max(
    0,
    report.companiesFound - report.companiesFailed - report.companiesWithDomain,
  );
  const withoutEmail = Math.max(0, report.companiesWithDomain - report.companiesWithEmail);
  return [
    { label: "Déjà en base (ignorées)", value: report.companiesSkippedExisting },
    { label: "Exclues par l’effectif (hors ICP)", value: report.companiesExcludedByHeadcount },
    { label: "Nouvelles entreprises traitées", value: report.companiesFound },
    { label: "en échec de traitement", value: report.companiesFailed, derived: true },
    { label: "sans site web trouvé", value: withoutSite, derived: true },
    { label: "avec site web", value: report.companiesWithDomain, derived: true },
    { label: "dont sans e-mail trouvé", value: withoutEmail, derived: true },
    { label: "Avec e-mail exploitable (leads)", value: report.companiesWithEmail },
  ];
}
