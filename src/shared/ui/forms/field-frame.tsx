"use client";

import type { ReactNode } from "react";

/**
 * Shared chrome for every field primitive in this module: label, optional
 * badge, and hint/error text under the control. Business-agnostic —
 * extracted from `features/onboarding` (2026-09-23) so it can back other
 * features' forms (e.g. the upcoming ICP/BANT creation flow) without
 * reaching into onboarding's internals.
 */
export interface FieldFrameProps {
  id: string;
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  children: ReactNode;
}

export function FieldFrame({ id, label, hint, error, optional, children }: FieldFrameProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-text-primary">
          {label}
        </label>
        {optional ? <span className="text-sm text-text-tertiary">Facultatif</span> : null}
      </div>
      {children}
      {error !== undefined ? (
        <p id={`${id}-error`} className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : hint !== undefined ? (
        <p id={`${id}-hint`} className="text-sm leading-5 text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
