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
          className="min-h-10 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
        >
          Valider la recommandation
        </button>
      )}
      <button
        type="button"
        onClick={onModify}
        className="min-h-10 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
      >
        Modifier la décision
      </button>
      <button
        type="button"
        onClick={onExclude}
        className="min-h-10 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Exclure
      </button>
    </div>
  );
}
