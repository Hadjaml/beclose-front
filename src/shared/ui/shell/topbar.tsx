import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  context?: ReactNode;
  notifications?: ReactNode;
  account?: ReactNode;
}

export function Topbar({ title, context, notifications, account }: TopbarProps) {
  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Contexte</p>
          <p className="truncate text-sm font-semibold text-zinc-950">{title}</p>
        </div>
        {context}
      </div>
      <div className="flex items-center gap-2">
        {notifications ?? (
          <span className="rounded-md border border-zinc-200 px-3 py-2 text-xs text-zinc-500">
            Notifications
          </span>
        )}
        {account ?? (
          <span className="rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700">
            Session
          </span>
        )}
      </div>
    </header>
  );
}
