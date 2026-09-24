"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ForbiddenState } from "@/shared/ui/states";
import { loginUrlWithReturn } from "../model/login-redirect";
import { SessionBoundary } from "./session-boundary";
import { useSession } from "./session-provider";

const unauthenticatedFallback = (
  <ForbiddenState
    title="Connexion requise"
    description="Connectez-vous pour accéder à cet espace."
    action={
      <Link
        href="/login"
        className="min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white"
      >
        Se connecter
      </Link>
    }
  />
);

const expiredFallback = (
  <ForbiddenState
    title="Session expirée"
    description="Votre session a pris fin. Redirection vers la page de connexion…"
    action={
      <Link
        href="/login"
        className="min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white"
      >
        Se reconnecter
      </Link>
    }
  />
);

/** Gates its children behind a valid session. Presentation only — the
 * backend re-authorizes every request regardless (AGENTS.md, "Workspace
 * isolation and access control"). */
export function RequireSession({ children }: { children: ReactNode }) {
  const { state, retrySessionCheck } = useSession();
  const router = useRouter();

  // A session lost while working (401) sends the user back to the login page,
  // with the page they were on as the return target.
  useEffect(() => {
    if (state.status !== "EXPIRED") return;
    router.replace(loginUrlWithReturn(window.location.pathname + window.location.search));
  }, [state.status, router]);

  return (
    <SessionBoundary
      state={state}
      unauthenticatedFallback={unauthenticatedFallback}
      expiredFallback={expiredFallback}
      onRetry={retrySessionCheck}
    >
      {children}
    </SessionBoundary>
  );
}
