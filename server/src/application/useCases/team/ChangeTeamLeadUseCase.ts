import { inject, injectable } from "tsyringe";
import { IChangeTeamLeadUseCase } from "../../interface/team/IChangeTeamLeadUseCase";
import { ITeamRepository } from "../../../domain/interfaces/repositories/Team/ITeamRepository";
import { ITeamMemberRepository } from "../../../domain/interfaces/repositories/TeamMember/ITeamMemberRepository";
import { ChangeTeamLeadDTO } from "../../dtos/team/requestDTOs/ChangeTeamLeadDTO";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class ChangeTeamLeadUseCase
  implements IChangeTeamLeadUseCase
{
  constructor(
    @inject("ITeamRepository")
    private _teamRepo: ITeamRepository,

    @inject("ITeamMemberRepository")
    private _teamMemberRepo: ITeamMemberRepository
  ) {}

  async execute(
    teamId: string,
    dto: ChangeTeamLeadDTO
  ): Promise<void> {
    // 1. Check whether the team exists
    const team = await this._teamRepo.findById(teamId);

    if (!team) {
      throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
    }

    // 2. Check whether the new lead is a member of the team
    const membership =
      await this._teamMemberRepo.findMembership(
        teamId,
        dto.leadId
      );

    if (!membership) {
      throw new Error(
        TEAM_ERRORS.TEAM_LEAD_MUST_BE_MEMBER
      );
    }

    // 3. Check whether the selected user is already the lead
    if (team.lead === dto.leadId) {
      throw new Error(
        TEAM_ERRORS.TEAM_LEAD_ALREADY_ASSIGNED
      );
    }

    // 4. Update the team lead
    const updatedTeam = await this._teamRepo.updateLead(
      teamId,
      dto.leadId
    );

    if (!updatedTeam) {
      throw new Error(TEAM_ERRORS.TEAM_NOT_FOUND);
    }
  }
}