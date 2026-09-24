export type DisconnectionOutcome = "done" | "nothing" | "manual-check";

export interface DisconnectionReport {
  outcome: DisconnectionOutcome;
  label: string;
  detail: string;
}

/**
 * Human wording for the statuses `POST /organizations/{id}/archive` returns
 * (Beclose `ArchiveDisconnectionsOut`, 24/09/2026). Anything ending in
 * `_locally_only` — or any value this list doesn't know yet — is reported as
 * "manual-check", never as a plain success: it means Beclose cleaned its own
 * side but could not confirm the external one (Google token revocation, bot
 * leaving the Telegram group).
 */
export function describeGmailDisconnection(status: string): DisconnectionReport {
  switch (status) {
    case "none":
      return { outcome: "nothing", label: "Gmail", detail: "Rien n’était connecté." };
    case "revoked":
      return {
        outcome: "done",
        label: "Gmail",
        detail: "Accès révoqué chez Google, connexion supprimée.",
      };
    case "removed_locally_only":
      return {
        outcome: "manual-check",
        label: "Gmail",
        detail:
          "Connexion supprimée côté Bewise, mais Google n’a pas confirmé la révocation — à vérifier à la main (permissions du compte Google concerné).",
      };
    default:
      return {
        outcome: "manual-check",
        label: "Gmail",
        detail: `Statut inattendu (« ${status} ») — à vérifier à la main.`,
      };
  }
}

export function describeTelegramDisconnection(status: string): DisconnectionReport {
  switch (status) {
    case "none":
      return { outcome: "nothing", label: "Telegram", detail: "Aucun groupe n’était renseigné." };
    case "left_group":
      return {
        outcome: "done",
        label: "Telegram",
        detail: "Le bot a quitté le groupe, l’identifiant a été effacé.",
      };
    case "cleared_locally_only":
      return {
        outcome: "manual-check",
        label: "Telegram",
        detail:
          "Identifiant effacé côté Bewise, mais le bot n’a pas pu quitter le groupe — à retirer à la main.",
      };
    default:
      return {
        outcome: "manual-check",
        label: "Telegram",
        detail: `Statut inattendu (« ${status} ») — à vérifier à la main.`,
      };
  }
}
