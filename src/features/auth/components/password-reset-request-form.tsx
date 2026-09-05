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
        <span className="text-sm font-semibold text-zinc-800">Adresse e-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 px-3.5 text-sm outline-none focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
        />
      </label>
      {error === undefined ? null : <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={onSubmit === undefined}
        className="min-h-11 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        Demander un lien
      </button>
    </form>
  );
}
