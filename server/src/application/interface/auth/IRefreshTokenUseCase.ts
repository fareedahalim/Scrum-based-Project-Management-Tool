import { RefreshTokenDTO } from "../../dtos/auth/requestDTOs/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../../dtos/auth/responseDTOs/RefreshTokenResponseDTO";

export interface IRefreshTokenUseCase {
    execute(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO>
} 