import type { z } from "zod";
import type { clientConfigurationSchema } from "../schemas/client-configuration-schema";

export type ClientConfiguration = z.infer<typeof clientConfigurationSchema>;
export type ClientConfigurationSectionId = keyof ClientConfiguration;

export interface ClientConfigurationSectionDefinition {
  id: ClientConfigurationSectionId;
  label: string;
  description: string;
}

export const clientConfigurationSections = [
  {
    id: "company",
    label: "Entreprise",
    description: "Identité, activité et interlocuteur principal.",
  },
  {
    id: "offer",
    label: "Offre",
    description: "Offre commerciale, valeur apportée et éléments de preuve.",
  },
  {
    id: "target",
    label: "Ciblage",
    description: "Entreprises, décideurs et critères de ciblage.",
  },
  {
    id: "qualification",
    label: "Qualification",
    description: "Critères, signaux positifs et motifs d’exclusion.",
  },
  {
    id: "approach",
    label: "Approche",
    description: "Positionnement, ton et garde-fous de communication.",
  },
  {
    id: "tools",
    label: "Outils",
    description: "Environnement dans lequel le client travaillera avec Bewise.",
  },
] as const satisfies readonly ClientConfigurationSectionDefinition[];
