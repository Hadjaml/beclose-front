/** `null` (denominator zero) reads as "—", never as 0 % — "nothing to
 * measure yet" and "measured, none" are different statements. */
export function formatShare(ratio: number | null): string {
  return ratio === null ? "—" : `${Math.round(ratio * 100)} %`;
}

/** French singular/plural for a counted noun: `plural(3, "issue")` →
 * "3 issues", `plural(1, "issue")` → "1 issue". */
export function plural(count: number, noun: string): string {
  return `${count} ${noun}${count > 1 ? "s" : ""}`;
}
