"use client";

export function InviteMemberAction({ onInvite }: { onInvite?: () => void }) {
  if (onInvite === undefined) return null;
  return (
    <button
      type="button"
      onClick={onInvite}
      className="min-h-10 rounded-app-md bg-brand-navy px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-violet"
    >
      Inviter un membre
    </button>
  );
}
