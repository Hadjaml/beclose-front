import { describe, expect, it } from "vitest";
import {
  missingConfiguration,
  sourcingBlockerLabel,
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
    expect(sourcingBlockers(config({ icpProfile: null }))).toEqual(["ICP_PROFILE_MISSING"]);
  });

  it("blocks when the ICP has no priority sector (audit A08 reproduction)", () => {
    expect(sourcingBlockers(config({ icpProfile: icpWith([]) }))).toEqual(["ICP_NO_PRIORITY_SECTORS"]);
  });

  it("blocks when tier-1 sectors have no usable French label", () => {
    expect(
      sourcingBlockers(config({ icpProfile: icpWith([{ tier: 1, sectors: [sector(null), sector("   ")] }]) })),
    ).toEqual(["ICP_SECTOR_LABELS_MISSING"]);
  });

  it("does not count a labelled sector of another tier", () => {
    expect(
      sourcingBlockers(config({ icpProfile: icpWith([{ tier: 2, sectors: [sector("Industrie")] }]) })),
    ).toEqual(["ICP_NO_PRIORITY_SECTORS"]);
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

describe("Beclose's own sourcingReadiness wins over the local derivation", () => {
  it("ready → no blocker, even if the local rule would block", () => {
    expect(
      sourcingBlockers(config({ icpProfile: icpWith([]), sourcingReadiness: { ready: true, blockers: [] } })),
    ).toEqual([]);
  });

  it("not ready → exactly Beclose's blockers, even if the local rule would not block", () => {
    expect(
      sourcingBlockers(config({ sourcingReadiness: { ready: false, blockers: ["ICP_PROFILE_INVALID"] } })),
    ).toEqual(["ICP_PROFILE_INVALID"]);
  });

  it("not ready without any blocker still blocks (never reads as fine)", () => {
    expect(sourcingBlockers(config({ sourcingReadiness: { ready: false, blockers: [] } }))).toHaveLength(1);
  });
});

describe("sourcingBlockerLabel", () => {
  it("speaks French for every known code", () => {
    for (const code of ["ICP_PROFILE_MISSING", "ICP_NO_PRIORITY_SECTORS", "ICP_SECTOR_LABELS_MISSING", "ICP_PROFILE_INVALID"]) {
      expect(sourcingBlockerLabel(code)).not.toContain("Précondition non remplie");
    }
  });

  it("degrades to a neutral label for a code it does not know, including prototype keys", () => {
    expect(sourcingBlockerLabel("SOMETHING_NEW")).toBe("Précondition non remplie : SOMETHING_NEW");
    expect(sourcingBlockerLabel("constructor")).toBe("Précondition non remplie : constructor");
  });
});
