import type { z } from "zod";
import type {
  interfacePreferencesSchema,
  settingsActionSchema,
  settingsSchema,
} from "../schemas/settings-schemas";

export type InterfacePreferences = z.infer<typeof interfacePreferencesSchema>;
export type SettingsAction = z.infer<typeof settingsActionSchema>;
export type Settings = z.infer<typeof settingsSchema>;
