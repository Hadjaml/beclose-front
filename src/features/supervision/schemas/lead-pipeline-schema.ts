import { z } from "zod";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

/**
 * Matches Beclose's `LeadCounts`/`OverviewOut` (`api/routers/organizations.py`)
 * as-is — keys stay snake_case, a deliberate pass-through of
 * `core/state_machine.LeadStatus` values, not relabelled to camelCase like
 * the rest of the envelope (contract decision, 2026-09-11). Distinct from
 * `WorkspaceSupervision` (`systemStatus`/`requiredActions`/...), which has
 * no backend data source yet — don't merge the two.
 */
export const leadCountsSchema = z.object({
  identified: z.number().int().nonnegative(),
  contacted: z.number().int().nonnegative(),
  replied: z.number().int().nonnegative(),
  qualified: z.number().int().nonnegative(),
  booked: z.number().int().nonnegative(),
  converted: z.number().int().nonnegative(),
  opted_out: z.number().int().nonnegative(),
  bounced: z.number().int().nonnegative(),
  disqualified: z.number().int().nonnegative(),
  handed_off: z.number().int().nonnegative(),
});

export const workspaceLeadPipelineSchema = z.object({
  workspaceId: workspaceIdSchema,
  totalLeads: z.number().int().nonnegative(),
  leadCounts: leadCountsSchema,
});
