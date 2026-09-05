import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

export const clientSummarySchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1),
  onboardingStatus: z.string().trim().min(1),
  onboardingProgress: z.number().min(0).max(100),
  systemStatus: z.string().trim().min(1),
  subscriptionStatus: z.string().trim().min(1),
});

export const clientListSchema = z.array(clientSummarySchema);
export type ClientSummary = z.infer<typeof clientSummarySchema>;
