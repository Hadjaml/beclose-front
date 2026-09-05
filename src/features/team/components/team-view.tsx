import { EmptyState } from "@/shared/ui/states";
import type { TeamOverview } from "../model/team";
import { InviteMemberAction } from "./invite-member-action";
import { InvitationList } from "./invitation-list";
import { TeamTable } from "./team-table";

export function TeamView({
  team,
  onInvite,
}: {
  team: TeamOverview | null;
  onInvite?: () => void;
}) {
  if (team === null || (team.members.length === 0 && team.invitations.length === 0)) {
    return (
      <EmptyState
        title="Aucun membre disponible"
        description="Les membres et invitations apparaîtront ici lorsqu’ils seront fournis."
        action={<InviteMemberAction {...(onInvite === undefined ? {} : { onInvite })} />}
      />
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <InviteMemberAction {...(onInvite === undefined ? {} : { onInvite })} />
      </div>
      {team.members.length === 0 ? null : <TeamTable members={team.members} />}
      <InvitationList invitations={team.invitations} />
    </div>
  );
}
