import {
  accountStatusLabels,
  type TeamMember,
} from "../model/team";

export function TeamTable({ members }: { members: readonly TeamMember[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Membres de l’équipe Bewise</caption>
        <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          <tr>
            <th scope="col" className="px-4 py-3">Membre</th>
            <th scope="col" className="px-4 py-3">Accès</th>
            <th scope="col" className="px-4 py-3">Rôle</th>
            <th scope="col" className="px-4 py-3">Compte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {members.map((member) => (
            <tr key={member.user.id}>
              <td className="px-4 py-4">
                <p className="font-semibold text-zinc-950">{member.user.displayName}</p>
                <p className="mt-1 text-zinc-600">{member.user.email}</p>
              </td>
              <td className="px-4 py-4 text-zinc-700">
                {member.accesses.length === 0
                  ? "Aucun workspace"
                  : `${member.accesses.length} workspace${member.accesses.length > 1 ? "s" : ""}`}
              </td>
              <td className="px-4 py-4 text-zinc-700">
                {[...new Set(member.accesses.map(({ roleLabel }) => roleLabel).filter(Boolean))].join(", ") || "—"}
              </td>
              <td className="px-4 py-4 text-zinc-700">
                {accountStatusLabels[member.user.accountStatus]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
