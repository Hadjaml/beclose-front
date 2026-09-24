interface FormatOptions {
  /** IANA zone; defaults to the viewer's own. Only tests need to pin it. */
  timeZone?: string;
}

function parse(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "24 sept. 2026, 09:05" — a value that cannot be parsed is returned as-is. */
export function formatDateTime(iso: string, { timeZone }: FormatOptions = {}): string {
  const date = parse(iso);
  if (date === null) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone === undefined ? {} : { timeZone }),
  }).format(date);
}

/** "24 septembre 2026". */
export function formatDate(iso: string, { timeZone }: FormatOptions = {}): string {
  const date = parse(iso);
  if (date === null) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    ...(timeZone === undefined ? {} : { timeZone }),
  }).format(date);
}
