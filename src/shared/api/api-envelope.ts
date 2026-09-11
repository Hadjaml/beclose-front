import { z } from "zod";

/**
 * Beclose's v0 API wraps every response body in `{ data }`, and paginates
 * list endpoints with `{ data, pagination: { limit, offset, total } }`
 * (`api/schemas.py`, `CamelModel`/`Pagination` — contract confirmed
 * 2026-09-11). Shared here so every feature's API module parses the same
 * envelope shape instead of redefining it.
 */
export function detailEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({ data: dataSchema });
}

export const paginationSchema = z.object({
  limit: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});
export type Pagination = z.infer<typeof paginationSchema>;

export function listEnvelopeSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({ data: z.array(itemSchema) });
}

export function paginatedEnvelopeSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({ data: z.array(itemSchema), pagination: paginationSchema });
}
