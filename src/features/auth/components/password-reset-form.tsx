"use client";

import { useState, type FormEvent } from "react";
import type { PasswordReset } from "../model/session";
import { passwordResetSchema } from "../schemas/session-schemas";

export function PasswordResetForm({
  resetToken,
  onSubmit,
}: {
  resetToken: string | null;
  onSubmit?: (request: PasswordReset) => void;
}) {
  const [error, setError] = useState<string>();
  const available = resetToken !== null && onSubmit !== undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available) return;
    const result = passwordResetSchema.safeParse({
      resetToken,
      password: new FormData(event.currentTarget).get("password"),
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
        <span className="text-sm font-semibold text-text-primary">Nouveau mot de passe</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="mt-2 min-h-11 w-full rounded-app-md border border-border-strong px-3.5 text-sm outline-none focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
        />
      </label>
      {error === undefined ? null : <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={!available}
        className="min-h-11 rounded-app-md bg-brand-navy px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-border-strong"
      >
        Enregistrer le mot de passe
      </button>
    </form>
  );
}
