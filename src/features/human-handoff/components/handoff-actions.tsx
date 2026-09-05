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
        className="min-h-10 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
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
        className="min-h-10 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
      >
        Reprendre la conversation
      </button>}
      {recommendation?.recommended && onLetSystemContinue !== undefined ? (
        <button
          type="button"
          onClick={onLetSystemContinue}
          className="min-h-10 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          Laisser le système poursuivre
        </button>
      ) : null}
    </div>
  );
}
