import { describe, expect, it } from "vitest";
import { googleConnectionHealth } from "./google-connection-health";

const google = (over: Record<string, unknown>) => ({
  connected: true,
  expiresAt: null,
  scopes: [],
  status: null,
  lastSuccessAt: null,
  lastFailureAt: null,
  lastFailureReason: null,
  ...over,
});

describe("googleConnectionHealth (Beclose status, not the access-token expiry)", () => {
  it("healthy is connected", () => {
    expect(googleConnectionHealth(google({ status: "healthy" }))).toMatchObject({ kind: "healthy", label: "Connecté", needsReconnect: false });
  });

  it("unknown is 'not yet verified' — never shown as connected", () => {
    const health = googleConnectionHealth(google({ status: "unknown" }));
    expect(health.kind).toBe("unverified");
    expect(health.label).toBe("Non encore vérifié");
    expect(health.label).not.toMatch(/^Connecté/);
    expect(health.needsReconnect).toBe(false);
  });

  it("stale says the last check is old, without asking for a reconnection", () => {
    expect(googleConnectionHealth(google({ status: "stale" }))).toMatchObject({ kind: "stale", label: "Dernière vérification ancienne", needsReconnect: false });
  });

  it("degraded is a transient incident: the connection is not revoked", () => {
    const health = googleConnectionHealth(google({ status: "degraded" }));
    expect(health.kind).toBe("degraded");
    expect(health.description).toContain("n’est pas révoquée");
    expect(health.needsReconnect).toBe(false);
  });

  it("reconnect_required is the only state that asks for a reconnection", () => {
    expect(googleConnectionHealth(google({ status: "reconnect_required", connected: false }))).toMatchObject({
      kind: "reconnect_required",
      label: "Reconnexion nécessaire",
      needsReconnect: true,
    });
  });

  it("an unknown status is stated as unknown, never guessed", () => {
    const health = googleConnectionHealth(google({ status: "brand_new" }));
    expect(health.kind).toBe("unrecognized");
    expect(health.label).toBe("Statut inconnu : brand_new");
    expect(health.needsReconnect).toBe(false);
  });

  it("without a status (older backend) it falls back to `connected`", () => {
    expect(googleConnectionHealth(google({ status: null, connected: true })).kind).toBe("healthy");
    expect(googleConnectionHealth(google({ status: null, connected: false })).needsReconnect).toBe(true);
  });

  it("no Google credential at all needs a first connection", () => {
    expect(googleConnectionHealth(null)).toMatchObject({ kind: "not_connected", needsReconnect: true });
  });
});
