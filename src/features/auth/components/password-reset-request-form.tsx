"use client";

import { useState, type FormEvent } from "react";
import type { PasswordResetRequest } from "../model/session";
import { passwordResetRequestSchema } from "../schemas/session-schemas";

export function PasswordResetRequestForm({
  onSubmit,
}: {
  onSubmit?: (request: PasswordResetRequest) => void;
}) {
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit === undefined) return;
    const result = passwordResetRequestSchema.safeParse({
      email: new FormData(event.currentTarget).get("email"),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    onSubmit(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Adresse e-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 min-h-11 w-full rounded-app-md border border-border-strong px-3.5 text-sm outline-none focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
        />
      </label>
      {error === undefined ? null : <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={onSubmit === undefined}
        className="min-h-11 rounded-app-md bg-brand-navy px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-border-strong"
      >
        Demander un lien
      </button>
    </form>
  );
}
