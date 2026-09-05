import type { TeamOverview } from "../model/team";

export interface TeamApi {
  getTeamOverview(): Promise<TeamOverview>;
}
