import { ITeamEntity } from "../../../entities/Team/ITeamEntity";
import { ITeamMemberEntity } from "../../../entities/TeamMember/ITeamMemberEntity";

export interface ITeamMemberRepository {
  addMember(
    teamMember: ITeamMemberEntity
  ): Promise<ITeamMemberEntity>;

  findMembership(
    teamId: string,
    userId: string
  ): Promise<ITeamMemberEntity | null>;

  findMembershipByUser(
    userId: string
  ): Promise<ITeamMemberEntity | null>;

  getMembersByTeam(
    teamId: string
  ): Promise<ITeamMemberEntity[]>;

  getTeamsByUser(
    userId: string
  ): Promise<ITeamEntity[]>;

  removeMember(
    teamId: string,
    userId: string
  ): Promise<boolean>;

  getAssignedUserIds(): Promise<string[]>;
}