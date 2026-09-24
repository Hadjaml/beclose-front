"use client";

import type { ReactNode } from "react";
import { ApiError, getApiErrorPresentation } from "@/shared/api/api-error";

/**
 * Inline submit-failure banner for a create/edit form — lighter than the
 * full-page `ErrorState` (`shared/ui/states`), which assumes it owns the
 * whole view. Built 2026-09-23 for the organization/ICP/BANT creation
 * steps, the first mutations in this codebase.
 */
export function MutationErrorBanner({
  error,
  title,
  description,
  action,
}: {
  error: unknown;
  /** Replaces the generic wording when the caller knows this failure. */
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  const presentation = getApiErrorPresentation(
    error instanceof ApiError ? error : new ApiError({ kind: "unknown", message: "Unknown error", cause: error }),
  );

  return (
    <div role="alert" className="rounded-app-md border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-semibold text-red-900">{title ?? presentation.title}</p>
      <p className="mt-1 text-sm text-red-800">{description ?? presentation.description}</p>
      {action === undefined ? null : <div className="mt-3">{action}</div>}
    </div>
  );
}
