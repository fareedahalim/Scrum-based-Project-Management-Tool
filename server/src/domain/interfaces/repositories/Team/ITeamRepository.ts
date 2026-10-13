import { ITeamEntity } from "../../../entities/Team/ITeamEntity";

export interface ITeamRepository {
  createTeam(
    team: ITeamEntity
  ): Promise<ITeamEntity>;

  findById(
    teamId: string
  ): Promise<ITeamEntity | null>;

  findByName(
    name: string
  ): Promise<ITeamEntity | null>;

  getAllTeams(): Promise<ITeamEntity[]>;

  getTeamsByMember(
    userId: string
  ): Promise<ITeamEntity[]>;

  updateTeam(
    teamId: string,
    data: Partial<ITeamEntity>
  ): Promise<ITeamEntity | null>;

  updateLead(
    teamId: string,
    leadId: string
  ): Promise<ITeamEntity | null>;



  deleteTeam(
    teamId: string
  ): Promise<boolean>;
}