import type { GeographyScopeInput } from "./geography-scope";

/**
 * What a configuration lacks before the client can be treated as set up
 * (audit A06/A08, 2026-09-24). Kept structural so it reads the parsed
 * `WorkspaceConfiguration` without depending on its full schema.
 */
export interface ReadinessInput {
  icpProfile: {
    criteria: {
      prioritySectors: readonly {
        tier: number;
        sectors: readonly { id: string; labelFr: string | null }[];
      }[];
    };
  } | null;
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

/** The tier a default sourcing run targets (Beclose `DEFAULT_TIERS = [1]`). */
const DEFAULT_SOURCING_TIER = 1;

/**
 * Why the default (ICP-driven) sourcing run cannot start. Beclose is the
 * authority: when it sends `sourcingReadiness` that is what is used.
 * The local derivation below only covers a Beclose build that predates that
 * field (same rule, same codes) — DELETE it once the field is deployed
 * everywhere; an absent field must then mean "unknown, do not block".
 */
export function sourcingBlockers(configuration: ReadinessInput): SourcingBlocker[] {
  const readiness = configuration.sourcingReadiness;
  if (readiness !== undefined && readiness !== null) {
    if (readiness.ready) return [];
    return readiness.blockers.length > 0 ? [...readiness.blockers] : ["UNSPECIFIED"];
  }
  if (configuration.icpProfile === null) return ["ICP_PROFILE_MISSING"];
  const sectors = configuration.icpProfile.criteria.prioritySectors
    .filter((group) => group.tier === DEFAULT_SOURCING_TIER)
    .flatMap((group) => group.sectors);
  if (sectors.length === 0) return ["ICP_NO_PRIORITY_SECTORS"];
  const hasLabel = sectors.some((sector) => sector.labelFr !== null && sector.labelFr.trim() !== "");
  return hasLabel ? [] : ["ICP_SECTOR_LABELS_MISSING"];
}
