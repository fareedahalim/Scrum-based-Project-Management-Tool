import { UpdateTeamDTO } from "../../dtos/team/requestDTOs/UpdateTeamDTO";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

export interface IUpdateTeamUseCase {
  execute(
    teamId: string,
    dto: UpdateTeamDTO
  ): Promise<TeamResponseDTO>;
}