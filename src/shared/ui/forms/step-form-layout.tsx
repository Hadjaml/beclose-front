"use client";

import type { FormEventHandler, ReactNode } from "react";

/**
 * Generic chrome for one step of a multi-step form: title, description,
 * fields, and a sticky back/continue footer. Business-agnostic — extracted
 * from `features/onboarding` (2026-09-23) for reuse by other step-based
 * flows.
 */
export interface StepFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: (() => void) | null;
  submitLabel?: string;
  /** While true the submit button is disabled and a submit event is ignored,
   * so a double click or a repeated Enter cannot fire the action twice. */
  isSubmitting?: boolean;
}

export function StepFormLayout({
  title,
  description,
  children,
  onSubmit,
  onBack,
  submitLabel = "Continuer",
  isSubmitting = false,
}: StepFormLayoutProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    if (isSubmitting) {
      event.preventDefault();
      return;
    }
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">{description}</p>
      </header>
      <div className="space-y-6">{children}</div>
      <footer className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        {onBack === null ? (
          <span />
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="rounded-app-md px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          >
            Étape précédente
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="brand-gradient-action brand-gradient-hover rounded-app-md px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          {submitLabel}
        </button>
      </footer>
    </form>
  );
}
