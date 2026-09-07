"use client";

import type {
  ConversationOwnership,
  HandoffRecommendation,
} from "../model/handoff";

interface HandoffActionsProps {
  ownership: ConversationOwnership;
  recommendation?: HandoffRecommendation;
  onTakeOver?: () => void;
  onLetSystemContinue?: () => void;
  onReturnToSystem?: () => void;
}

export function HandoffActions({
  ownership,
  recommendation,
  onTakeOver,
  onLetSystemContinue,
  onReturnToSystem,
}: HandoffActionsProps) {
  if (ownership.owner === "HUMAN") {
    if (onReturnToSystem === undefined) return null;
    return (
      <button
        type="button"
        onClick={onReturnToSystem}
        className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
      >
        Rendre la main au système
      </button>
    );
  }

  if (onTakeOver === undefined && onLetSystemContinue === undefined) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {onTakeOver === undefined ? null : <button
        type="button"
        onClick={onTakeOver}
        className="min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white hover:bg-brand-navy-hover"
      >
        Reprendre la conversation
      </button>}
      {recommendation?.recommended && onLetSystemContinue !== undefined ? (
        <button
          type="button"
          onClick={onLetSystemContinue}
          className="min-h-10 rounded-app-md border border-border-strong px-4 text-sm font-semibold text-text-primary hover:bg-surface-muted"
        >
          Laisser le système poursuivre
        </button>
      ) : null}
    </div>
  );
}
