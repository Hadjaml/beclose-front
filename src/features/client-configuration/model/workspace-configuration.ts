import type { z } from "zod";
import type {
  icpProfileVersionSchema,
  qualificationCriteriaVersionSchema,
  workspaceConfigurationSchema,
} from "../schemas/workspace-configuration-schema";

export type QualificationCriteriaVersion = z.infer<typeof qualificationCriteriaVersionSchema>;
export type IcpProfileVersion = z.infer<typeof icpProfileVersionSchema>;
export type WorkspaceConfiguration = z.infer<typeof workspaceConfigurationSchema>;
