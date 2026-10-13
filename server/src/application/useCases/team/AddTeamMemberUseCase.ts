import { inject, injectable } from "tsyringe";

import { IAddTeamMemberUseCase } from "../../interface/team/IAddTeamMemberUseCase";

import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";

import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";

import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

import { AddTeamMemberDTO } from "../../dtos/team/requestDTOs/AddTeamMemberDTO";

import { ITeamMemberEntity } from "../../../domain/entities/TeamMember/ITeamMemberEntity";

import { TEAM_ERRORS, USER_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class AddTeamMemberUseCase
  implements IAddTeamMemberUseCase
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
    teamId: string,
    dto: AddTeamMemberDTO
  ): Promise<void> {
    // 1. Check whether team exists
    const team =
      await this._teamRepo.findById(teamId);

    if (!team) {
      throw new Error(
        TEAM_ERRORS.TEAM_NOT_FOUND
      );
    }

    // 2. Check whether user exists
    const user =
      await this._userRepo.findById(
        dto.userId
      );

    if (!user) {
      throw new Error(
        USER_ERRORS.USER_NOT_FOUND
      );
    }

    // 3. Check whether user is already
    // a member of this team
    const existingMembership =
      await this._teamMemberRepo.findMembership(
        teamId,
        dto.userId
      );

    if (existingMembership) {
      throw new Error(
        TEAM_ERRORS.TEAM_MEMBER_ALREADY_EXISTS
      );
    }

    const existingTeamMembership =
  await this._teamMemberRepo.findMembershipByUser(
    dto.userId
  );

if (existingTeamMembership) {
  throw new Error(
    TEAM_ERRORS.USER_ALREADY_BELONGS_TO_TEAM
  );
}

    // 4. Create team membership
    const teamMember: ITeamMemberEntity = {
      teamId,
      userId: dto.userId,
      joinedAt: new Date(),
    };

    await this._teamMemberRepo.addMember(
      teamMember
    );
  }
}