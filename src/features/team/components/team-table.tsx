import {
  accountStatusLabels,
  type TeamMember,
} from "../model/team";

export function TeamTable({ members }: { members: readonly TeamMember[] }) {
  return (
    <div className="overflow-x-auto rounded-app-lg border border-border bg-surface">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Membres de l’équipe Bewise</caption>
        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-secondary">
          <tr>
            <th scope="col" className="px-4 py-3">Membre</th>
            <th scope="col" className="px-4 py-3">Accès</th>
            <th scope="col" className="px-4 py-3">Rôle</th>
            <th scope="col" className="px-4 py-3">Compte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => (
            <tr key={member.user.id}>
              <td className="px-4 py-4">
                <p className="font-semibold text-text-primary">{member.user.displayName}</p>
                <p className="mt-1 text-text-secondary">{member.user.email}</p>
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {member.accesses.length === 0
                  ? "Aucun workspace"
                  : `${member.accesses.length} workspace${member.accesses.length > 1 ? "s" : ""}`}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {[...new Set(member.accesses.map(({ roleLabel }) => roleLabel).filter(Boolean))].join(", ") || "—"}
              </td>
              <td className="px-4 py-4 text-text-secondary">
                {accountStatusLabels[member.user.accountStatus]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
