import { MyTeamResponseDTO } from "../../dtos/team/responseDTOs/MyTeamResponseDTO";

export interface IGetMyTeamUseCase {
    execute(userId: string): Promise<MyTeamResponseDTO | null>;
}