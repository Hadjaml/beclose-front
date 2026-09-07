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
      <h2 id="team-invitations-title" className="text-lg font-semibold text-text-primary">
        Invitations
      </h2>
      <ul className="divide-y divide-border rounded-app-lg border border-border bg-surface">
        {invitations.map((invitation) => (
          <li key={invitation.id} className="flex flex-wrap justify-between gap-3 p-4 text-sm">
            <div>
              <p className="font-semibold text-text-primary">{invitation.email}</p>
              {invitation.roleLabel === undefined ? null : (
                <p className="mt-1 text-text-secondary">{invitation.roleLabel}</p>
              )}
            </div>
            <span className="font-medium text-text-secondary">
              {invitationStatusLabels[invitation.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
