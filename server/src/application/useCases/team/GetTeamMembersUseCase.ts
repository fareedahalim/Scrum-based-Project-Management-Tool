import { inject, injectable } from "tsyringe";

import { IGetTeamMembersUseCase } from "../../interface/team/IGetTeamMembersUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";


@injectable()
export class GetTeamMembersUseCase
  implements IGetTeamMembersUseCase
{
  constructor(
    @inject("ITeamRepository")
    private _teamRepo: ITeamRepository,

    @inject("ITeamMemberRepository")
    private _teamMemberRepo: ITeamMemberRepository,

    @inject("IUserRepository")
    private _userRepo: IUserRepository
  ) {}

  async execute(
    teamId: string
  ) {
    const team = await this._teamRepo.findById(teamId);

    if (!team) {
      throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
    }

    const memberships =
      await this._teamMemberRepo.getMembersByTeam(
        teamId
      );

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await this._userRepo.findById(
          membership.userId
        );

        if (!user) {
          return null;
        }

        return {
          id: membership._id!,
          userId: membership.userId,
          teamId: membership.teamId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: user.profileImage ?? null,
          joinedAt: membership.joinedAt,
        };
      })
    );

    return members.filter(
      (member): member is NonNullable<typeof member> =>
        member !== null
    );
  }
}