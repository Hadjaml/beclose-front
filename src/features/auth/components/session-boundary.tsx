import type { ReactNode } from "react";
import { ErrorState, ForbiddenState, LoadingState } from "@/shared/ui/states";
import type { SessionState } from "../model/session-state";

interface SessionBoundaryProps {
  state: SessionState;
  children: ReactNode;
  unauthenticatedFallback: ReactNode;
  expiredFallback?: ReactNode;
  onRetry?: () => void;
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
  onRetry,
}: SessionBoundaryProps) {
  switch (state.status) {
    case "UNKNOWN":
      return <LoadingState label="Vérification de la session…" />;
    case "UNAUTHENTICATED":
      return unauthenticatedFallback;
    case "EXPIRED":
      return expiredFallback;
    case "ERROR":
      return (
        <ErrorState
          title="Vérification de session impossible"
          description="Le service de session est momentanément indisponible."
          {...(onRetry === undefined ? {} : { onRetry })}
          {...(state.error.requestId === undefined ? {} : { requestId: state.error.requestId })}
        />
      );
    case "AUTHENTICATED":
      return children;
  }
}
