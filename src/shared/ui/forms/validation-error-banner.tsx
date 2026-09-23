"use client";

/**
 * Inline banner shown when client-side (Zod) validation blocks a submit —
 * distinct from `MutationErrorBanner` (a failed API call). Built 2026-09-23
 * after a real report ("cliquer ne fait rien") turned out to be exactly
 * this: a blank required field only produced a small per-field error text
 * (`FieldFrame`'s own `error` line), easy to miss with no banner at the top
 * of a long form — indistinguishable, at a glance, from the click doing
 * nothing at all.
 */
export function ValidationErrorBanner() {
  return (
    <div role="alert" className="rounded-app-md border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Informations manquantes ou invalides</p>
      <p className="mt-1 text-sm text-amber-800">
        Corrigez les champs signalés ci-dessous avant de continuer.
      </p>
    </div>
  );
}
