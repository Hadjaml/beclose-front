import type { GeographyScopeInput } from "./geography-scope";

/**
 * What a configuration lacks before the client can be treated as set up
 * (audit A06/A08, 2026-09-24). Kept structural so it reads the parsed
 * `WorkspaceConfiguration` without depending on its full schema.
 */
export interface ReadinessInput {
  icpProfile: unknown | null;
  qualificationCriteria: unknown | null;
  /** Beclose's own verdict; absent on a build that predates it. */
  sourcingReadiness?: {
    ready: boolean;
    blockers: readonly string[];
    geography?: GeographyScopeInput | null;
  } | null;
}

export type MissingConfiguration = "icp" | "bant";

/** Onboarding steps Beclose has no data for yet — the same client can
 * always be resumed to fill them. */
export function missingConfiguration(configuration: ReadinessInput): MissingConfiguration[] {
  const missing: MissingConfiguration[] = [];
  if (configuration.icpProfile === null) missing.push("icp");
  if (configuration.qualificationCriteria === null) missing.push("bant");
  return missing;
}

export const missingConfigurationLabels = {
  icp: "le profil ICP",
  bant: "la grille BANT",
} as const satisfies Record<MissingConfiguration, string>;

/** Beclose's stable blocker codes (`GET /configuration` →
 * `sourcingReadiness.blockers`, and `422 SOURCING_PRECONDITION_FAILED`).
 * Open on purpose: a code added later must degrade to a neutral label,
 * never fail a page. */
export const knownSourcingBlockers = [
  "ICP_PROFILE_MISSING",
  "ICP_NO_PRIORITY_SECTORS",
  "ICP_SECTOR_LABELS_MISSING",
  "ICP_PROFILE_INVALID",
] as const;
export type KnownSourcingBlocker = (typeof knownSourcingBlockers)[number];
export type SourcingBlocker = string;

export const sourcingBlockerLabels = {
  ICP_PROFILE_MISSING: "Aucun profil ICP actif n’est enregistré.",
  ICP_NO_PRIORITY_SECTORS:
    "Le profil ICP n’a aucun secteur prioritaire de rang 1 : le sourcing n’aurait aucune cible.",
  ICP_SECTOR_LABELS_MISSING:
    "Les secteurs prioritaires de rang 1 n’ont aucun libellé français : le sourcing ne saurait pas quoi chercher.",
  ICP_PROFILE_INVALID: "Le profil ICP actif ne respecte pas le schéma attendu.",
} as const satisfies Record<KnownSourcingBlocker, string>;

/** Never throws on a code Beclose added after this was written. */
export function sourcingBlockerLabel(code: SourcingBlocker): string {
  return Object.hasOwn(sourcingBlockerLabels, code)
    ? sourcingBlockerLabels[code as KnownSourcingBlocker]
    : `Précondition non remplie : ${code}`;
}

/**
 * Why the default (ICP-driven) sourcing run cannot start — Beclose's own
 * verdict (`sourcingReadiness`), never a local guess. No verdict (a backend
 * that does not send it) means "unknown": nothing is blocked here and Beclose
 * still refuses a run it cannot do (`422 SOURCING_PRECONDITION_FAILED`).
 */
export function sourcingBlockers(configuration: ReadinessInput): SourcingBlocker[] {
  const readiness = configuration.sourcingReadiness;
  if (readiness === undefined || readiness === null || readiness.ready) return [];
  return readiness.blockers.length > 0 ? [...readiness.blockers] : ["UNSPECIFIED"];
}
