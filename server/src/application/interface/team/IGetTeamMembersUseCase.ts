import { TeamMemberResponseDTO } from "../../dtos/team/responseDTOs/TeamMemberResponseDTO";

export interface IGetTeamMembersUseCase {
  execute(
    teamId: string
  ): Promise<TeamMemberResponseDTO[]>;
}