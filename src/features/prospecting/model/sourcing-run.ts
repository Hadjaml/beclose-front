import { describeEnumValue } from "@/shared/schemas/tolerant-enum";
import type {
  sourcingRunStageValues,
  sourcingStopReasonValues,
  SourcingReport,
  SourcingRun,
} from "../schemas/sourcing-run-schema";

export type SourcingRunDisplayStatus = "running" | "succeeded" | "failed" | "interrupted" | "unknown";

/** A run killed by a service restart is stored as `failed` with the message
 * "interrompu" (Beclose marks leftover `running` rows at API startup) —
 * shown apart from a genuine failure since nothing went wrong in the run
 * itself. */
export function sourcingRunDisplayStatus(run: SourcingRun): SourcingRunDisplayStatus {
  if (run.status === "failed" && /interrompu/i.test(run.errorMessage ?? "")) return "interrupted";
  // A status Beclose added after this was written: neutral, never an error.
  switch (run.status) {
    case "running":
      return "running";
    case "succeeded":
      return "succeeded";
    case "failed":
      return "failed";
    default:
      return "unknown";
  }
}

/** Label of the badge; an unknown status keeps its raw value visible. */
export function sourcingRunStatusLabel(run: SourcingRun): string {
  const display = sourcingRunDisplayStatus(run);
  return display === "unknown"
    ? `Statut inconnu : ${run.status}`
    : sourcingRunStatusLabels[display];
}

export const sourcingRunStatusLabels: Record<SourcingRunDisplayStatus, string> = {
  running: "En cours",
  succeeded: "Terminé",
  failed: "Échoué",
  interrupted: "Interrompu",
  unknown: "Statut inconnu",
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
  const lines: SourcingFunnelLine[] = [];
  if (report.pagesFetched !== null) lines.push({ label: "Pages consultées", value: report.pagesFetched });
  if (report.companiesConsulted !== null) {
    lines.push({ label: "Candidats examinés", value: report.companiesConsulted });
  }
  lines.push(
    { label: "Déjà en base (ignorées)", value: report.companiesSkippedExisting },
    { label: "Exclues par l’effectif (hors ICP)", value: report.companiesExcludedByHeadcount },
    { label: "Nouvelles entreprises traitées", value: report.companiesFound },
    { label: "en échec de traitement", value: report.companiesFailed, nested: true },
  );
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
  if (report.companiesRetried !== null) {
    lines.push({ label: "Entreprises connues re-tentées (sans lead)", value: report.companiesRetried });
    if (report.companiesRecovered !== null) {
      lines.push({ label: "dont récupérées", value: report.companiesRecovered, nested: true });
    }
  }
  return lines;
}

export const sourcingStageLabels = {
  starting: "Démarrage",
  resolving_targets: "Résolution des secteurs cibles",
  processing: "Traitement des entreprises",
  finished: "Terminé",
} as const satisfies Record<(typeof sourcingRunStageValues)[number], string>;

/** `null` when the backend sent no stage; neutral for one it does not know. */
export function sourcingStageLabel(stage: SourcingRun["stage"]): string | null {
  return stage === null ? null : describeEnumValue(sourcingStageLabels, stage, "Étape inconnue");
}

export const sourcingStopReasonLabels = {
  target_reached: "Objectif atteint",
  results_exhausted: "Résultats de la source épuisés",
  page_budget_exhausted: "Limite de pages atteinte avant l’objectif",
} as const satisfies Record<(typeof sourcingStopReasonValues)[number], string>;

export function sourcingStopReasonLabel(reason: NonNullable<SourcingReport["stopReason"]>): string {
  return describeEnumValue(sourcingStopReasonLabels, reason, "Raison d’arrêt inconnue");
}
