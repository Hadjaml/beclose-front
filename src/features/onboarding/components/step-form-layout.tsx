"use client";

import type { FormEventHandler, ReactNode } from "react";

interface StepFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: (() => void) | null;
  submitLabel?: string;
}

export function StepFormLayout({
  title,
  description,
  children,
  onSubmit,
  onBack,
  submitLabel = "Continuer",
}: StepFormLayoutProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
      </header>
      <div className="space-y-6">{children}</div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
        {onBack === null ? <span /> : (
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Étape précédente
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          {submitLabel}
        </button>
      </footer>
    </form>
  );
}
