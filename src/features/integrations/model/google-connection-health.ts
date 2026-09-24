import type { GoogleIntegrationStatus } from "./workspace-integration-status";

export type GoogleConnectionKind =
  | "healthy"
  | "unverified"
  | "stale"
  | "degraded"
  | "reconnect_required"
  | "not_connected"
  | "unrecognized";

export interface GoogleConnectionHealth {
  kind: GoogleConnectionKind;
  label: string;
  description: string;
  tone: "ok" | "info" | "warning" | "error";
  /** Only a refused refresh token (or no credential at all) needs a
   * (re)connection: an expired ACCESS token renews itself. */
  needsReconnect: boolean;
}

/**
 * How the Gmail connection really stands, from Beclose's `status`
 * (24/09/2026). `expiresAt` is the ACCESS token's expiry (about an hour) —
 * information, never a connection state. `unknown` means no Google call has
 * been recorded yet and is NOT "connected". A status added later is stated as
 * unknown. Without a `status` (a backend that predates it) it falls back to
 * the legacy `connected` flag.
 */
export function googleConnectionHealth(google: GoogleIntegrationStatus | null): GoogleConnectionHealth {
  if (google === null) {
    return {
      kind: "not_connected",
      label: "Gmail non connecté",
      description: "Aucun accès Google n’est enregistré pour ce client.",
      tone: "warning",
      needsReconnect: true,
    };
  }
  switch (google.status) {
    case "healthy":
      return { kind: "healthy", label: "Connecté", description: "Les derniers appels à Google ont abouti.", tone: "ok", needsReconnect: false };
    case "unknown":
      return {
        kind: "unverified",
        label: "Non encore vérifié",
        description: "Aucun appel à Google n’a encore été enregistré : la connexion sera vérifiée au prochain envoi ou à la prochaine relève.",
        tone: "info",
        needsReconnect: false,
      };
    case "stale":
      return {
        kind: "stale",
        label: "Dernière vérification ancienne",
        description: "Aucun appel à Google n’a abouti récemment ; ce n’est pas une déconnexion.",
        tone: "warning",
        needsReconnect: false,
      };
    case "degraded":
      return {
        kind: "degraded",
        label: "Incident transitoire",
        description: "Un appel à Google a échoué récemment, mais la connexion n’est pas révoquée : elle devrait se rétablir seule.",
        tone: "warning",
        needsReconnect: false,
      };
    case "reconnect_required":
      return {
        kind: "reconnect_required",
        label: "Reconnexion nécessaire",
        description: "Google a refusé le renouvellement de l’accès : il faut reconnecter Gmail.",
        tone: "error",
        needsReconnect: true,
      };
    case null:
    case undefined:
      return google.connected
        ? { kind: "healthy", label: "Connecté", description: "", tone: "ok", needsReconnect: false }
        : {
            kind: "reconnect_required",
            label: "Reconnexion nécessaire",
            description: "",
            tone: "error",
            needsReconnect: true,
          };
    default:
      return {
        kind: "unrecognized",
        label: `Statut inconnu : ${google.status}`,
        description: "Ce statut n’est pas reconnu par cette version de l’interface.",
        tone: "info",
        needsReconnect: false,
      };
  }
}

export function googleFailureReasonLabel(reason: string | null): string | null {
  if (reason === null) return null;
  switch (reason) {
    case "refresh_refused":
      return "renouvellement de l’accès refusé";
    case "error":
      return "Erreur lors du dernier appel à Google";
    default:
      return `Cause inconnue : ${reason}`;
  }
}
