"use client";

import { useRouter } from "next/navigation";
import type { SessionState } from "../model/session-state";
import { useSession } from "./session-provider";

export function SessionMenu({
  state,
  onLogout,
}: {
  state: SessionState;
  onLogout?: () => void;
}) {
  if (state.status !== "AUTHENTICATED") return null;

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-medium text-text-secondary sm:inline">
        {state.session.user.displayName}
      </span>
      {onLogout === undefined ? null : (
        <button
          type="button"
          onClick={onLogout}
          className="min-h-10 rounded-app-md border border-border-strong px-3 text-sm font-semibold text-text-primary hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
        >
          Se déconnecter
        </button>
      )}
    </div>
  );
}

export function CurrentSessionMenu() {
  const router = useRouter();
  const { state, logout } = useSession();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      // `logout()` already forgets the local session even on failure — the
      // navigation should happen either way.
      router.replace("/login");
    }
  }

  return <SessionMenu state={state} onLogout={() => void handleLogout()} />;
}
