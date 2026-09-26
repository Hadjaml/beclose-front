import type { z } from "zod";
import type {
  googleIntegrationStatusSchema,
  notionIntegrationStatusSchema,
  workspaceIntegrationStatusSchema,
} from "../schemas/workspace-integration-status-schema";

export type GoogleIntegrationStatus = z.infer<typeof googleIntegrationStatusSchema>;
export type WorkspaceIntegrationStatus = z.infer<typeof workspaceIntegrationStatusSchema>;
export type NotionIntegrationStatus = z.infer<typeof notionIntegrationStatusSchema>;
