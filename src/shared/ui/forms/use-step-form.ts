"use client";

import { useState } from "react";
import type { ZodType } from "zod";

/** Keyed by the full dot-joined Zod issue path (e.g. `"name"` for a flat
 * schema, `"companyFit.employeeRange.min"` for a nested one) — not just the
 * top-level field. A flat schema's paths are always a single segment, so
 * this is a superset of the previous `Partial<Record<keyof T, string>>`
 * shape, not a breaking change for existing flat-schema callers
 * (`errors.name` still resolves the same way).
 *
 * Fixed 2026-09-23: the original top-level-only shape silently discarded
 * everything below the first path segment — on a deeply nested schema
 * (ICP/BANT criteria), every error under e.g. `companyFit` collapsed into
 * one message with no way to tell which of its many sub-fields actually
 * failed, and most step components never even read `errors` for their
 * nested sections in the first place. Real bug hit live: `profileName`
 * (never bound to any visible field, see icp-step.tsx/bant-step.tsx) always
 * failed silently — the only visible symptom was a generic "fill
 * everything" banner pointing at nothing.
 */
export type FieldErrors = Record<string, string>;

export function useStepForm<T extends object>(initialData: T, schema: ZodType<T>) {
  const [draft, setDraft] = useState<T>(initialData);
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateField<K extends keyof T>(field: K, value: T[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const prefix = `${String(field)}.`;
      let changed = false;
      const next: FieldErrors = {};
      for (const [path, message] of Object.entries(current)) {
        if (path === String(field) || path.startsWith(prefix)) {
          changed = true;
          continue;
        }
        next[path] = message;
      }
      return changed ? next : current;
    });
  }

  function validate(): T | null {
    const result = schema.safeParse(draft);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (nextErrors[path] === undefined) nextErrors[path] = issue.message;
    }
    setErrors(nextErrors);
    return null;
  }

  return { draft, errors, updateField, validate };
}
