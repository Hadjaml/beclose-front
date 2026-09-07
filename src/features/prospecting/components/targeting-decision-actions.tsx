"use client";

import type { TargetingDecision } from "../model/prospecting";

interface TargetingDecisionActionsProps {
  recommendation?: TargetingDecision;
  onValidate: () => void;
  onModify: () => void;
  onExclude: () => void;
}

export function TargetingDecisionActions({
  recommendation,
  onValidate,
  onModify,
  onExclude,
}: TargetingDecisionActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {recommendation === undefined ? null : (
        <button
          type="button"
          onClick={onValidate}
          className="brand-gradient-action brand-gradient-hover min-h-10 rounded-app-md px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          Valider la recommandation
        </button>
      )}
      <button
        type="button"
        onClick={onModify}
        className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
      >
        Modifier la décision
      </button>
      <button
        type="button"
        onClick={onExclude}
        className="min-h-10 rounded-app-md border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Exclure
      </button>
    </div>
  );
}
