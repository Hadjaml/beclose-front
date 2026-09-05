"use client";

export function InviteMemberAction({ onInvite }: { onInvite?: () => void }) {
  if (onInvite === undefined) return null;
  return (
    <button
      type="button"
      onClick={onInvite}
      className="min-h-10 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
    >
      Inviter un membre
    </button>
  );
}
