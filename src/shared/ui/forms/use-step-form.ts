"use client";

import { useState } from "react";
import type { ZodType } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Local-draft + Zod-validation state for one step of a multi-step form.
 * Business-agnostic — extracted from `features/onboarding`
 * (2026-09-23) for reuse by other step-based flows.
 */
export function useStepForm<T extends object>(initialData: T, schema: ZodType<T>) {
  const [draft, setDraft] = useState<T>(initialData);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  function updateField<K extends keyof T>(field: K, value: T[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): T | null {
    const result = schema.safeParse(draft);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: FieldErrors<T> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && nextErrors[field as keyof T] === undefined) {
        nextErrors[field as keyof T] = issue.message;
      }
    }
    setErrors(nextErrors);
    return null;
  }

  return { draft, errors, updateField, validate };
}
