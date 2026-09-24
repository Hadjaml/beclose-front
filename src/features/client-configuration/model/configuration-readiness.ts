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

export type SourcingBlocker = "no_icp_profile" | "no_labelled_tier_one_sector";

/** The tier a default sourcing run targets (Beclose `DEFAULT_TIERS = [1]`,
 * and the button sends no tier). */
const DEFAULT_SOURCING_TIER = 1;

/**
 * Why the default sourcing run (ICP-driven, tier 1) cannot start, per
 * Beclose's own preconditions in `workers/sourcing.py`: an active ICP
 * profile with at least one tier-1 sector carrying a French label. This
 * duplicates a backend rule on purpose, only to avoid announcing "ready" or
 * offering a run that is known to fail — Beclose stays the authority and
 * still refuses if the rule ever changes. No extra business threshold is
 * invented here.
 */
export function sourcingBlockers(configuration: ReadinessInput): SourcingBlocker[] {
  if (configuration.icpProfile === null) return ["no_icp_profile"];
  const hasLabelledSector = configuration.icpProfile.criteria.prioritySectors.some(
    (group) =>
      group.tier === DEFAULT_SOURCING_TIER &&
      group.sectors.some((sector) => sector.labelFr !== null && sector.labelFr.trim() !== ""),
  );
  return hasLabelledSector ? [] : ["no_labelled_tier_one_sector"];
}

export const sourcingBlockerLabels = {
  no_icp_profile: "Aucun profil ICP n’est enregistré.",
  no_labelled_tier_one_sector:
    "Le profil ICP n’a aucun secteur prioritaire de rang 1 avec un libellé français : le sourcing n’aurait aucune cible.",
} as const satisfies Record<SourcingBlocker, string>;
