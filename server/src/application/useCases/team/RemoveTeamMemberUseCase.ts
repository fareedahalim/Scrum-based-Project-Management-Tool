import { inject, injectable } from "tsyringe";
import { IRemoveTeamMemberUseCase } from "../../interface/team/IRemoveTeamMemberUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class RemoveTeamMemberUseCase
  implements IRemoveTeamMemberUseCase
{
  constructor(
    @inject("ITeamRepository")
    private _teamRepo: ITeamRepository,

    @inject("ITeamMemberRepository")
    private _teamMemberRepo: ITeamMemberRepository
  ) {}

  async execute(teamId: string, userId: string): Promise<void> {
    // 1. Check whether the team exists
    const team = await this._teamRepo.findById(teamId);

    if (!team) {
      throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
    }

    // 2. Check whether the user is a member of the team
    const membership = await this._teamMemberRepo.findMembership(
      teamId,
      userId
    );

    if (!membership) {
      throw new Error(TEAM_ERRORS.TEAM_MEMBER_NOT_FOUND);
    }

    // 3. Team lead cannot be removed directly
    if (team.lead === userId) {
      throw new Error(TEAM_ERRORS.TEAM_LEAD_CANNOT_BE_REMOVED);
    }

    // 4. Remove the member
    const removed = await this._teamMemberRepo.removeMember(
      teamId,
      userId
    );

    if (!removed) {
      throw new Error(TEAM_ERRORS.TEAM_MEMBER_NOT_FOUND);
    }
  }
}