import type { z } from "zod";
import type { leadProspectDetailSchema } from "../schemas/lead-prospect-detail-schema";

export type LeadProspectDetail = z.infer<typeof leadProspectDetailSchema>;
