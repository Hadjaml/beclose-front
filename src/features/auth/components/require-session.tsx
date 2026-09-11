"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ForbiddenState } from "@/shared/ui/states";
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

/** Gates its children behind a valid session. Presentation only — the
 * backend re-authorizes every request regardless (AGENTS.md, "Workspace
 * isolation and access control"). */
export function RequireSession({ children }: { children: ReactNode }) {
  const { state, retrySessionCheck } = useSession();
  return (
    <SessionBoundary
      state={state}
      unauthenticatedFallback={unauthenticatedFallback}
      onRetry={retrySessionCheck}
    >
      {children}
    </SessionBoundary>
  );
}
