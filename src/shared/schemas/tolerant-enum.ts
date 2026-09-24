import { z } from "zod";

/**
 * Transverse rule (decided 2026-09-24, prompted by a real near-miss: Beclose
 * added a `cancelled` message status and the closed enum would have failed the
 * whole messages list): a status the backend passes through as-is must NEVER
 * be able to fail a whole list or page just because the backend gained a value
 * the frontend has not heard of yet.
 *
 * `tolerantEnum` accepts every string. The output type stays the *open union*
 * `Known | (string & {})`: comparisons against the known values still work and
 * still autocomplete, but nothing narrows an unknown value into a label map —
 * that goes through `describeEnumValue`, which falls back to a neutral label.
 *
 * Use it only for values the backend owns and may extend (statuses). A value
 * the frontend itself decides on (a request body, a UI state) stays a closed
 * `z.enum`.
 */
export type TolerantEnum<Known extends string> = Known | (string & Record<never, never>);

const reportedUnknownValues = new Set<string>();

/** Tolerant, but not silent: outside production an unknown value is logged
 * once, so a vocabulary drift between Beclose and this frontend is noticed
 * during development instead of only ever showing as a neutral label. */
export function tolerantEnum<const Values extends readonly [string, ...string[]]>(
  knownValues: Values,
) {
  const known = new Set<string>(knownValues);
  return z.string().transform((value): TolerantEnum<Values[number]> => {
    if (
      process.env.NODE_ENV !== "production" &&
      !known.has(value) &&
      !reportedUnknownValues.has(value)
    ) {
      reportedUnknownValues.add(value);
      console.warn(`Unknown backend enum value "${value}" (known: ${knownValues.join(", ")}).`);
    }
    return value;
  });
}

/** Label for a known value, otherwise a neutral "unknown" label that carries
 * the raw value — visible enough to notice and report, never an error. */
export function describeEnumValue<Known extends string>(
  labels: Readonly<Record<Known, string>>,
  value: TolerantEnum<Known>,
  unknownPrefix = "Statut inconnu",
): string {
  return Object.hasOwn(labels, value) ? labels[value as Known] : `${unknownPrefix} : ${value}`;
}
