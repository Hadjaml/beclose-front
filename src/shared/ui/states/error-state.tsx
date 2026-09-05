import { StateLayout } from "./state-layout";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Réessayez dans quelques instants.",
  onRetry,
}: ErrorStateProps) {
  const action = onRetry === undefined ? undefined : (
    <button
      type="button"
      className="mt-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
      onClick={onRetry}
    >
      Réessayer
    </button>
  );
  return <StateLayout title={title} description={description} action={action} role="alert" />;
}
