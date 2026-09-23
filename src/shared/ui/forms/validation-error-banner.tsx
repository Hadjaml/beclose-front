"use client";

import type { FieldErrors } from "./use-step-form";

/**
 * Inline banner shown when client-side (Zod) validation blocks a submit —
 * distinct from `MutationErrorBanner` (a failed API call). Built 2026-09-23
 * after a real report ("cliquer ne fait rien") turned out to be a blank
 * required field with only a small per-field error text, no banner.
 *
 * Extended the same day after a second real report on a much bigger form
 * (the ICP step): a generic "fill everything in" message pointed at
 * nothing, on a schema deeply nested enough that the actual failing field
 * was never rendered by any visible section at all (`profileName` — a real
 * bug fixed separately, not just a display gap). Now lists every failing
 * path with Beclose/Zod's own message — a raw, humanized dot-path
 * ("company Fit › employee Range › min") is not pretty, but it is
 * unambiguous, which a fully generic banner cannot be on a form this deep
 * without hand-building a label for every nested field this form and the
 * next one will ever have.
 */
function humanizePath(path: string): string {
  return path
    .split(".")
    .map((segment) => {
      if (/^\d+$/.test(segment)) return `élément ${Number(segment) + 1}`;
      return segment
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .toLowerCase();
    })
    .join(" › ");
}

export function ValidationErrorBanner({ errors }: { errors?: FieldErrors }) {
  const entries = errors === undefined ? [] : Object.entries(errors);

  return (
    <div role="alert" className="rounded-app-md border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Informations manquantes ou invalides</p>
      {entries.length === 0 ? (
        <p className="mt-1 text-sm text-amber-800">
          Corrigez les champs signalés ci-dessous avant de continuer.
        </p>
      ) : (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-800">
          {entries.map(([path, message]) => (
            <li key={path}>
              <span className="font-medium">{humanizePath(path)}</span> — {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
