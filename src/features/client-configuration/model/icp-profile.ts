import type { z } from "zod";
import type { commercialMaturityLevelSchema, icpCriteriaSchema, icpProfileSchema } from "../schemas/icp-profile-schema";

export type IcpCriteria = z.infer<typeof icpCriteriaSchema>;
export type IcpProfile = z.infer<typeof icpProfileSchema>;

export const commercialMaturityLabels = {
  M0: "M0 — Pas de prospection structurée",
  M1: "M1 — Prospection portée par le dirigeant",
  M2: "M2 — Offre validée, prospection encore manuelle",
  M3: "M3 — Équipe commerciale structurée",
  M4: "M4 — Organisation enterprise",
} as const satisfies Record<z.infer<typeof commercialMaturityLevelSchema>, string>;
