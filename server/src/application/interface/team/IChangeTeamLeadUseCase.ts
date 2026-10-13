import { ChangeTeamLeadDTO } from "../../dtos/team/requestDTOs/ChangeTeamLeadDTO";

export interface IChangeTeamLeadUseCase {
  execute(
    teamId: string,
    dto: ChangeTeamLeadDTO
  ): Promise<void>;
}