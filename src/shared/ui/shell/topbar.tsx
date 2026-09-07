import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  context?: ReactNode;
  notifications?: ReactNode;
  account?: ReactNode;
}

export function Topbar({ title, context, notifications, account }: TopbarProps) {
  const hasActions = notifications !== undefined || account !== undefined;

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">Contexte</p>
          <p className="truncate text-sm font-semibold text-brand-navy">{title}</p>
        </div>
        {context}
      </div>
      {hasActions ? (
        <div className="flex items-center gap-2">
          {notifications}
          {account}
        </div>
      ) : null}
    </header>
  );
}
