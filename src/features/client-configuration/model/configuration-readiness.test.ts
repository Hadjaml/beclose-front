import { describe, expect, it } from "vitest";
import {
  missingConfiguration,
  sourcingBlockers,
  type ReadinessInput,
} from "./configuration-readiness";

const sector = (labelFr: string | null) => ({ id: "s", labelFr });
const icpWith = (prioritySectors: { tier: number; sectors: { id: string; labelFr: string | null }[] }[]) => ({
  criteria: { prioritySectors },
});

function config(over: Partial<ReadinessInput> = {}): ReadinessInput {
  return {
    icpProfile: icpWith([{ tier: 1, sectors: [sector("Conseil en informatique")] }]),
    qualificationCriteria: {},
    ...over,
  };
}

describe("missingConfiguration", () => {
  it("is empty when both policies exist", () => {
    expect(missingConfiguration(config())).toEqual([]);
  });

  it("lists each policy that does not exist yet", () => {
    expect(missingConfiguration(config({ icpProfile: null, qualificationCriteria: null }))).toEqual(["icp", "bant"]);
    expect(missingConfiguration(config({ qualificationCriteria: null }))).toEqual(["bant"]);
  });
});

describe("sourcingBlockers (mirrors Beclose's preconditions for the default tier-1 run)", () => {
  it("is empty when a tier-1 sector has a French label", () => {
    expect(sourcingBlockers(config())).toEqual([]);
  });

  it("blocks when there is no ICP profile at all", () => {
    expect(sourcingBlockers(config({ icpProfile: null }))).toEqual(["no_icp_profile"]);
  });

  it("blocks when the ICP has no priority sector (audit A08 reproduction)", () => {
    expect(sourcingBlockers(config({ icpProfile: icpWith([]) }))).toEqual(["no_labelled_tier_one_sector"]);
  });

  it("blocks when tier-1 sectors have no usable French label", () => {
    expect(
      sourcingBlockers(config({ icpProfile: icpWith([{ tier: 1, sectors: [sector(null), sector("   ")] }]) })),
    ).toEqual(["no_labelled_tier_one_sector"]);
  });

  it("does not count a labelled sector of another tier", () => {
    expect(
      sourcingBlockers(config({ icpProfile: icpWith([{ tier: 2, sectors: [sector("Industrie")] }]) })),
    ).toEqual(["no_labelled_tier_one_sector"]);
  });

  it("one labelled tier-1 sector is enough even if others are unlabelled", () => {
    expect(
      sourcingBlockers(
        config({ icpProfile: icpWith([{ tier: 1, sectors: [sector(null), sector("Conseil")] }]) }),
      ),
    ).toEqual([]);
  });

  it("does not depend on the BANT grid", () => {
    expect(sourcingBlockers(config({ qualificationCriteria: null }))).toEqual([]);
  });
});
