import {
  invitationStatusLabels,
  type TeamInvitation,
} from "../model/team";

export function InvitationList({
  invitations,
}: {
  invitations: readonly TeamInvitation[];
}) {
  if (invitations.length === 0) return null;
  return (
    <section className="space-y-3" aria-labelledby="team-invitations-title">
      <h2 id="team-invitations-title" className="text-lg font-semibold text-zinc-950">
        Invitations
      </h2>
      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="flex flex-wrap justify-between gap-3 p-4 text-sm">
            <div>
              <p className="font-semibold text-zinc-950">{invitation.email}</p>
              {invitation.roleLabel === undefined ? null : (
                <p className="mt-1 text-zinc-600">{invitation.roleLabel}</p>
              )}
            </div>
            <span className="font-medium text-zinc-700">
              {invitationStatusLabels[invitation.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
