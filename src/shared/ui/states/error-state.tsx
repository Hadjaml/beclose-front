import { StateLayout } from "./state-layout";
import { SupportReference } from "./support-reference";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  requestId?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Réessayez dans quelques instants.",
  onRetry,
  requestId,
}: ErrorStateProps) {
  const retryAction = onRetry === undefined ? undefined : (
    <button
      type="button"
      className="mt-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
      onClick={onRetry}
    >
      Réessayer
    </button>
  );
  const hasAction = retryAction !== undefined || requestId !== undefined;

  return (
    <StateLayout
      title={title}
      description={description}
      action={hasAction ? (
        <div className="space-y-3">
          {retryAction}
          {requestId === undefined ? null : (
            <SupportReference requestId={requestId} />
          )}
        </div>
      ) : undefined}
      role="alert"
    />
  );
}
