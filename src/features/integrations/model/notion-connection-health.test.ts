import { describe, expect, it } from "vitest";
import { notionConnectionHealth, notionFailureReasonLabel } from "./notion-connection-health";

const notion = (over: Record<string, unknown>) => ({
  connected: true,
  status: null,
  lastSuccessAt: null,
  lastFailureAt: null,
  lastFailureReason: null,
  pendingSyncs: 0,
  exhaustedSyncs: 0,
  ...over,
});

describe("notionConnectionHealth", () => {
  it("no Notion connection needs a first connection", () => {
    expect(notionConnectionHealth(null)).toMatchObject({ kind: "not_connected", needsConnection: true });
  });

  it("healthy is connected", () => {
    expect(notionConnectionHealth(notion({ status: "healthy" }))).toMatchObject({ kind: "healthy", label: "Connecté", needsConnection: false });
  });

  it("unknown is 'not yet verified', never connected", () => {
    const health = notionConnectionHealth(notion({ status: "unknown" }));
    expect(health.label).toBe("Non encore vérifié");
    expect(health.needsConnection).toBe(false);
  });

  it("degraded: sends are retried automatically, no reconnection asked", () => {
    const health = notionConnectionHealth(notion({ status: "degraded" }));
    expect(health.kind).toBe("degraded");
    expect(health.description).toContain("repris automatiquement");
    expect(health.needsConnection).toBe(false);
  });

  it("reconnect_required is the only status that asks to relaunch the connection", () => {
    expect(notionConnectionHealth(notion({ status: "reconnect_required", connected: false }))).toMatchObject({
      kind: "reconnect_required",
      label: "Reconnexion nécessaire",
      needsConnection: true,
    });
  });

  it("an unknown status is stated as unknown, never guessed", () => {
    const health = notionConnectionHealth(notion({ status: "brand_new" }));
    expect(health.label).toBe("Statut inconnu : brand_new");
    expect(health.needsConnection).toBe(false);
  });

  it("without a status it falls back to `connected`", () => {
    expect(notionConnectionHealth(notion({ status: null, connected: true })).kind).toBe("healthy");
    expect(notionConnectionHealth(notion({ status: null, connected: false })).needsConnection).toBe(true);
  });
});

describe("notionFailureReasonLabel", () => {
  it("speaks French for each known reason", () => {
    for (const reason of ["unauthorized", "database_unreachable", "schema_mismatch", "rate_limited", "error"]) {
      expect(notionFailureReasonLabel(reason)).not.toContain("Cause inconnue");
    }
  });

  it("is neutral on an unknown reason, and null on none", () => {
    expect(notionFailureReasonLabel("brand_new")).toBe("Cause inconnue : brand_new");
    expect(notionFailureReasonLabel(null)).toBeNull();
    expect(notionFailureReasonLabel("constructor")).toBe("Cause inconnue : constructor");
  });
});
