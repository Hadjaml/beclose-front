export function PaginationControls({
  limit,
  offset,
  total,
  onPrevious,
  onNext,
}: {
  limit: number;
  offset: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const hasPrevious = offset > 0;
  const hasNext = offset + limit < total;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-text-secondary">
      <p>
        {from}–{to} sur {total}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="min-h-9 rounded-app-md border border-border-strong px-3 text-sm font-semibold text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="min-h-9 rounded-app-md border border-border-strong px-3 text-sm font-semibold text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
