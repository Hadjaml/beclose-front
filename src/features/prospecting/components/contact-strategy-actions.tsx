"use client";

interface ContactStrategyActionsProps {
  onValidate: () => void;
  onModify: () => void;
}

export function ContactStrategyActions({
  onValidate,
  onModify,
}: ContactStrategyActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onValidate}
        className="brand-gradient-action brand-gradient-hover min-h-10 rounded-app-md px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
      >
        Valider la stratégie
      </button>
      <button
        type="button"
        onClick={onModify}
        className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
      >
        Modifier
      </button>
    </div>
  );
}
