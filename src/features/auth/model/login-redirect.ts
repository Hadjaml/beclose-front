const DEFAULT_REDIRECT = "/backoffice";
const ALLOWED_AREAS = ["/backoffice", "/portal"] as const;

/** The page to return to after login, from a `redirectTo` query value.
 * Only an in-app path inside a known area is honoured — anything else
 * (absolute URL, `//host`, another area, junk) falls back to the default so
 * the login page cannot be used as an open redirect. */
export function safeLoginRedirect(raw: string | null | undefined): string {
  if (raw === null || raw === undefined) return DEFAULT_REDIRECT;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return DEFAULT_REDIRECT;
  const inKnownArea = ALLOWED_AREAS.some(
    (area) => raw === area || (raw.startsWith(area) && /^[/?#]/.test(raw.slice(area.length))),
  );
  return inKnownArea ? raw : DEFAULT_REDIRECT;
}

export function loginUrlWithReturn(currentPath: string): string {
  return `/login?redirectTo=${encodeURIComponent(currentPath)}`;
}
