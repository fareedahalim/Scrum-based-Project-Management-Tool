import { AddTeamMemberDTO } from "../../dtos/team/requestDTOs/AddTeamMemberDTO";

export interface IAddTeamMemberUseCase {
  execute(
    teamId: string,
    dto: AddTeamMemberDTO
  ): Promise<void>;
}