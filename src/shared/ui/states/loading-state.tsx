interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Chargement…" }: LoadingStateProps) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-text-secondary" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-brand-blue-violet" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
