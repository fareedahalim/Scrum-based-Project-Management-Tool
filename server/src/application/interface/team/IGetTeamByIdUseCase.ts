import { UserRoles } from "../../../domain/enums/UserRole";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

export interface IGetTeamByIdUseCase {
  execute(
    teamId: string,
    userId: string,
    role: UserRoles
  ): Promise<TeamResponseDTO>;
}