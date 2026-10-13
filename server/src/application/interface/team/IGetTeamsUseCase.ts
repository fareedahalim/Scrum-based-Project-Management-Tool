import { UserRoles } from "../../../domain/enums/UserRole";
import { TeamResponseDTO } from "../../dtos/team/responseDTOs/TeamResponseDTO";

export interface IGetTeamsUseCase {
    execute(userId: string, role: UserRoles): Promise<TeamResponseDTO[]>
}