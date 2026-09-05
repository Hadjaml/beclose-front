import type { z } from "zod";
import type {
  integrationActionSchema,
  integrationCapabilitySchema,
  integrationCategorySchema,
  integrationConnectionSchema,
  integrationConnectionStatusSchema,
  integrationProviderSchema,
  workspaceIntegrationsSchema,
} from "../schemas/integration-schemas";

export type IntegrationCategory = z.infer<typeof integrationCategorySchema>;
export type IntegrationConnectionStatus = z.infer<typeof integrationConnectionStatusSchema>;
export type IntegrationProvider = z.infer<typeof integrationProviderSchema>;
export type IntegrationCapability = z.infer<typeof integrationCapabilitySchema>;
export type IntegrationAction = z.infer<typeof integrationActionSchema>;
export type IntegrationConnection = z.infer<typeof integrationConnectionSchema>;
export type WorkspaceIntegrations = z.infer<typeof workspaceIntegrationsSchema>;

export const integrationCategoryLabels = {
  CRM: "CRM",
  MESSAGING: "Messagerie et canaux",
  CALENDAR: "Calendrier",
  INTERNAL_COMMUNICATION: "Communication interne",
  OTHER: "Autres outils",
} as const satisfies Record<IntegrationCategory, string>;

export const integrationConnectionStatusLabels = {
  NOT_CONNECTED: "Non connectée",
  CONNECTING: "Connexion en cours",
  CONNECTED: "Connectée",
  NEEDS_ATTENTION: "Attention requise",
  ERROR: "Erreur",
  DISCONNECTED: "Déconnectée",
} as const satisfies Record<IntegrationConnectionStatus, string>;
