import { UserResponseDTO } from "../../dtos/user/responseDTOs/UserResponseDTO";

export interface IGetAvailableTeamMembersUseCase {
  execute(): Promise<UserResponseDTO[]>;
}