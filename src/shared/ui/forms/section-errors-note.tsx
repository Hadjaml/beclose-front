"use client";

import type { FieldErrors } from "./use-step-form";

/**
 * Compact, section-scoped error list — for a nested fieldset (ICP/BANT
 * criteria sections) where wiring a precise red border into every leaf
 * primitive (`NumericRangeField`'s min/max, each `RepeatableGroupField`
 * item…) is a larger refactor than today's fix warrants. Filters
 * `errors` to only the paths starting with `prefix`, strips that prefix
 * before display so the message reads relative to the section the user is
 * already looking at (e.g. inside "Adéquation entreprise",
 * "employeeRange.min" rather than the full
 * "companyFit.employeeRange.min"). Renders nothing when there is no
 * matching error — safe to always mount at the top of every section.
 */
function humanizeRelativePath(path: string): string {
  return path
    .split(".")
    .map((segment) => {
      if (/^\d+$/.test(segment)) return `élément ${Number(segment) + 1}`;
      return segment.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
    })
    .join(" › ");
}

export function SectionErrorsNote({ errors, prefix }: { errors: FieldErrors; prefix: string }) {
  const matches = Object.entries(errors)
    .filter(([path]) => path === prefix || path.startsWith(`${prefix}.`))
    .map(([path, message]) => {
      const relative = path === prefix ? "" : path.slice(prefix.length + 1);
      return { key: path, label: relative === "" ? null : humanizeRelativePath(relative), message };
    });

  if (matches.length === 0) return null;

  return (
    <div role="alert" className="rounded-app-md border border-red-200 bg-red-50 p-3">
      <ul className="list-inside list-disc space-y-1 text-sm text-red-800">
        {matches.map(({ key, label, message }) => (
          <li key={key}>
            {label === null ? null : <span className="font-medium">{label}</span>}
            {label === null ? null : " — "}
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
