"use client";

import { useState, type FormEvent } from "react";
import type { LoginCredentials } from "../model/session";
import { loginCredentialsSchema } from "../schemas/session-schemas";

export function LoginForm({
  onSubmit,
  forgotPasswordAction,
}: {
  onSubmit?: (credentials: LoginCredentials) => void;
  forgotPasswordAction?: React.ReactNode;
}) {
  const [error, setError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit === undefined) return;
    const formData = new FormData(event.currentTarget);
    const result = loginCredentialsSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Vérifiez les informations saisies.");
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
      <label className="block">
        <span className="text-sm font-semibold text-text-primary">Mot de passe</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 min-h-11 w-full rounded-app-md border border-border-strong px-3.5 text-sm outline-none focus:border-brand-blue-violet focus:ring-2 focus:ring-brand-blue-violet/15"
        />
      </label>
      {error === undefined ? null : (
        <p role="alert" className="text-sm text-red-700">{error}</p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={onSubmit === undefined}
          className="min-h-11 rounded-app-md bg-brand-navy px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-border-strong"
        >
          Se connecter
        </button>
        {forgotPasswordAction}
      </div>
    </form>
  );
}
