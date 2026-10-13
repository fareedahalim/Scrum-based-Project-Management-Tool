import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../../interface/auth/IRefreshTokenUseCase";
import { JwtService } from "../../../infrastructure/service/JwtService";
import { UserRepository } from "../../../infrastructure/database/repositories/User/UserRepository";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { RefreshTokenDTO } from "../../dtos/auth/requestDTOs/RefreshTokenDTO";
import { AuthDTOmapper } from "../../mappers/Auth/AuthDTOmappers";
import { RefreshTokenResponseDTO } from "../../dtos/auth/responseDTOs/RefreshTokenResponseDTO";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject('IJwtService') private _jwtService: JwtService,
        @inject('IUserRepository') private _userRepository: UserRepository
    ){}

    async execute(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
console.log("entering to the refreshtoken ")
        const payload = this._jwtService.verifyRefreshToken(dto.refreshToken);
        
        if(!payload) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN)
        }

        const user = await this._userRepository.findById(payload.userId);
console.log("the refreshtoken user=",user)
        if(!user) {
            throw new Error(USER_ERRORS.USER_NOT_FOUND);
        }

        if(!user.isActive) {
            throw new Error(USER_ERRORS.USER_NOT_ACTIVE);
        }

        const newPayload = {
            userId: user._id!,
            role: user.role
        }

        const accessToken = this._jwtService.signAccessToken(newPayload);
        return AuthDTOmapper.toRefreshTokenResponseDTO(user,accessToken);
    }
}