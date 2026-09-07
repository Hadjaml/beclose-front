interface BatchActionBarProps {
  selectionCount: number;
  onValidate: () => void;
  onVerify: () => void;
  onExclude: () => void;
}

export function BatchActionBar({
  selectionCount,
  onValidate,
  onVerify,
  onExclude,
}: BatchActionBarProps) {
  if (selectionCount === 0) {
    return null;
  }

  const buttonClassName =
    "min-h-10 rounded-app-md border border-border-strong bg-surface px-3 text-sm font-semibold text-text-primary transition hover:border-border-strong hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-app-lg bg-brand-navy p-3 text-white">
      <p className="mr-auto px-1 text-sm font-medium">
        {selectionCount} prospect{selectionCount > 1 ? "s" : ""} sélectionné{selectionCount > 1 ? "s" : ""}
      </p>
      <button type="button" onClick={onValidate} className={buttonClassName}>Valider</button>
      <button type="button" onClick={onVerify} className={buttonClassName}>Passer à vérifier</button>
      <button type="button" onClick={onExclude} className={buttonClassName}>Exclure</button>
    </div>
  );
}
