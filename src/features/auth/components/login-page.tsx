"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { LoginCredentials } from "../model/session";
import { LoginForm } from "./login-form";
import { useSession } from "./session-provider";

/**
 * Wires `LoginForm` to the real session (`useSession`). Only Back Office
 * login exists today — Beclose has no client-facing auth yet (see
 * `.claude/skills/bewise-app/SKILL.md`, "Lien avec Beclose") — so this
 * always redirects into `/backoffice`.
 */
export function LoginPage({
  redirectTo = "/backoffice",
  forgotPasswordAction,
}: {
  redirectTo?: string;
  forgotPasswordAction?: ReactNode;
}) {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useSession();

  function handleSubmit(credentials: LoginCredentials) {
    login(credentials)
      .then(() => router.replace(redirectTo))
      .catch(() => {
        // `loginError` is already set by useSession()'s login(); nothing
        // else to do here, the form re-renders with it.
      });
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isSubmitting={isLoggingIn}
      {...(loginError === undefined ? {} : { serverError: loginError })}
      {...(forgotPasswordAction === undefined ? {} : { forgotPasswordAction })}
    />
  );
}
