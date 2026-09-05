export type IntegrationStatus =
  | "not_connected"
  | "connected"
  | "attention"
  | "error";

export const integrationCategories = [
  "CRM",
  "E-mail",
  "LinkedIn",
  "Instagram",
  "Calendrier",
  "Autres outils",
] as const;

export const integrationStatusLabels: Record<IntegrationStatus, string> = {
  not_connected: "Non connectée",
  connected: "Connectée",
  attention: "Attention requise",
  error: "Erreur",
};
