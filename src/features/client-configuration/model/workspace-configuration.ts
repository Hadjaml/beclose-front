import type { z } from "zod";
import type {
  qualificationCriteriaVersionSchema,
  workspaceConfigurationSchema,
} from "../schemas/workspace-configuration-schema";

export type QualificationCriteriaVersion = z.infer<typeof qualificationCriteriaVersionSchema>;
export type WorkspaceConfiguration = z.infer<typeof workspaceConfigurationSchema>;
