import type { ReactNode } from "react";
import { ForbiddenState, LoadingState } from "@/shared/ui/states";
import type { SessionState } from "../model/session-state";

interface SessionBoundaryProps {
  state: SessionState;
  children: ReactNode;
  unauthenticatedFallback: ReactNode;
  expiredFallback?: ReactNode;
}

export function SessionBoundary({
  state,
  children,
  unauthenticatedFallback,
  expiredFallback = (
    <ForbiddenState
      title="Session expirée"
      description="Reconnectez-vous pour continuer en toute sécurité."
    />
  ),
}: SessionBoundaryProps) {
  switch (state.status) {
    case "UNKNOWN":
      return <LoadingState label="Vérification de la session…" />;
    case "UNAUTHENTICATED":
      return unauthenticatedFallback;
    case "EXPIRED":
      return expiredFallback;
    case "AUTHENTICATED":
      return children;
  }
}
