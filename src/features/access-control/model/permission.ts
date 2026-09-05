import { z } from "zod";

export const permissionSchema = z.string().trim().regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/);
export type Permission = z.infer<typeof permissionSchema>;

export function definePermission(value: string): Permission {
  return permissionSchema.parse(value);
}

export const permissions = {
  prospectRead: definePermission("prospect:read"),
  prospectReview: definePermission("prospect:review"),
  conversationRead: definePermission("conversation:read"),
  conversationTakeover: definePermission("conversation:takeover"),
  appointmentRead: definePermission("appointment:read"),
  appointmentManage: definePermission("appointment:manage"),
  performanceRead: definePermission("performance:read"),
  approvalRead: definePermission("approval:read"),
  approvalDecide: definePermission("approval:decide"),
  integrationRead: definePermission("integration:read"),
  integrationManage: definePermission("integration:manage"),
} as const satisfies Record<string, Permission>;
