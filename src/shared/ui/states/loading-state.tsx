interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Chargement…" }: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-zinc-600" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
