import { z } from "zod";
import { supervisionPrioritySchema } from "@/features/supervision";
import { workspaceIdSchema } from "@/shared/workspace/workspace";

const optionalText = z.string().trim().min(1).optional();

export const notificationStateSchema = z.enum(["UNREAD", "READ"]);

export const notificationDestinationSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

export const notificationSchema = z.object({
  id: z.string().trim().min(1),
  userId: optionalText,
  workspaceId: workspaceIdSchema.optional(),
  type: z.string().trim().min(1),
  priority: supervisionPrioritySchema.optional(),
  title: z.string().trim().min(1),
  summary: optionalText,
  occurredAt: z.string().datetime({ offset: true }),
  state: notificationStateSchema,
  destination: notificationDestinationSchema.optional(),
});

export const notificationListSchema = z.array(notificationSchema);
