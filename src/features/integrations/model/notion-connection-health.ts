import type { NotionIntegrationStatus } from "./workspace-integration-status";

export type NotionConnectionKind =
  | "healthy"
  | "unverified"
  | "degraded"
  | "reconnect_required"
  | "not_connected"
  | "unrecognized";

export interface NotionConnectionHealth {
  kind: NotionConnectionKind;
  label: string;
  description: string;
  tone: "ok" | "info" | "warning" | "error";
  /** Only "never connected" and `reconnect_required` (token refused, or the
   * database is no longer shared or was deleted) need the connection to be
   * (re)launched on Bewise's side. */
  needsConnection: boolean;
}

/** How the Notion connection really stands, from Beclose's `status`. `unknown`
 * = no call yet — NOT connected. A status added later is stated as unknown. */
export function notionConnectionHealth(notion: NotionIntegrationStatus | null): NotionConnectionHealth {
  if (notion === null) {
    return {
      kind: "not_connected",
      label: "Notion non connecté",
      description: "Aucune connexion Notion n’est enregistrée pour ce client.",
      tone: "warning",
      needsConnection: true,
    };
  }
  switch (notion.status) {
    case "healthy":
      return { kind: "healthy", label: "Connecté", description: "Le dernier appel à Notion a abouti.", tone: "ok", needsConnection: false };
    case "unknown":
      return {
        kind: "unverified",
        label: "Non encore vérifié",
        description: "Aucun appel à Notion n’a encore été enregistré : la connexion sera vérifiée à la prochaine copie.",
        tone: "info",
        needsConnection: false,
      };
    case "degraded":
      return {
        kind: "degraded",
        label: "Incident transitoire",
        description: "Un appel à Notion a échoué (structure, débit ou panne) ; les envois sont repris automatiquement.",
        tone: "warning",
        needsConnection: false,
      };
    case "reconnect_required":
      return {
        kind: "reconnect_required",
        label: "Reconnexion nécessaire",
        description: "Le jeton a été refusé, ou la base Notion n’est plus partagée ou a été supprimée : il faut relancer la connexion.",
        tone: "error",
        needsConnection: true,
      };
    case null:
    case undefined:
      return notion.connected
        ? { kind: "healthy", label: "Connecté", description: "", tone: "ok", needsConnection: false }
        : { kind: "reconnect_required", label: "Reconnexion nécessaire", description: "", tone: "error", needsConnection: true };
    default:
      return {
        kind: "unrecognized",
        label: `Statut inconnu : ${notion.status}`,
        description: "Ce statut n’est pas reconnu par cette version de l’interface.",
        tone: "info",
        needsConnection: false,
      };
  }
}

export function notionFailureReasonLabel(reason: string | null): string | null {
  if (reason === null) return null;
  switch (reason) {
    case "unauthorized":
      return "jeton refusé par Notion";
    case "database_unreachable":
      return "base Notion introuvable ou non partagée";
    case "schema_mismatch":
      return "structure de la base incompatible";
    case "rate_limited":
      return "limite de débit de Notion atteinte";
    case "error":
      return "erreur lors du dernier appel à Notion";
    default:
      return `Cause inconnue : ${reason}`;
  }
}
