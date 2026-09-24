import { describe, expect, it } from "vitest";
import {
  missingConfiguration,
  sourcingBlockerLabel,
  sourcingBlockers,
  type ReadinessInput,
} from "./configuration-readiness";

function config(over: Partial<ReadinessInput> = {}): ReadinessInput {
  return { icpProfile: {}, qualificationCriteria: {}, ...over };
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

describe("sourcingBlockers — Beclose's own verdict, never a local guess", () => {
  it("no verdict (backend that does not send it) = unknown: nothing is blocked", () => {
    expect(sourcingBlockers(config())).toEqual([]);
    expect(sourcingBlockers(config({ icpProfile: null }))).toEqual([]);
    expect(sourcingBlockers(config({ sourcingReadiness: null }))).toEqual([]);
  });

  it("ready → no blocker", () => {
    expect(sourcingBlockers(config({ sourcingReadiness: { ready: true, blockers: [] } }))).toEqual([]);
  });

  it("not ready → exactly Beclose's blockers", () => {
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
