import { z } from "zod";

export const permissionSchema = z.string().trim().regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/);
export type Permission = z.infer<typeof permissionSchema>;

export function definePermission(value: string): Permission {
  return permissionSchema.parse(value);
}
