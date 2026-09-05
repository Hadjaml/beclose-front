import type { z } from "zod";
import type {
  notificationSchema,
  notificationStateSchema,
} from "../schemas/notification-schemas";

export type NotificationState = z.infer<typeof notificationStateSchema>;
export type Notification = z.infer<typeof notificationSchema>;
