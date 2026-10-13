import { CreateTeamDTO } from "../../dtos/team/requestDTOs/CreateTeamDTO";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

export interface ICreateTeamUseCase {
    execute(dto: CreateTeamDTO): Promise<TeamResponseDTO> ;
}