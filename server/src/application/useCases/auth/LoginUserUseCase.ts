import { inject, injectable } from "tsyringe";
import { ILoginUserUseCase } from "../../interface/auth/ILoginUserUseCase";
import { LoginUserDTO } from "../../dtos/auth/requestDTOs/LoginUserDTO";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
import { AuthDTOmapper } from "../../mappers/Auth/AuthDTOmappers";

@injectable()
export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        @inject('IUserRepository') private _userRepository: IUserRepository,
        @inject('IPasswordService') private _passwordService: IPasswordService,
        @inject('IJwtService') private _jwtService: IJwtService

    ) { }

    async execute(dto: LoginUserDTO) {
        const user = await this._userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        if (!user.isActive) {
            throw new Error(USER_ERRORS.USER_NOT_ACTIVE)
        }

        if (!user.isEmailVerified) {
            throw new Error(USER_ERRORS.USER_EMAIL_NOT_VERIFIED)
        }

        if (!user.password) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isMatch = await this._passwordService.compare(
            dto.password,
            user.password
        );
        if (!isMatch) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (!user._id) {
            throw new Error(USER_ERRORS.USER_ID_MISSING)
        }

        const payload = {
            userId: user._id,
            role: user.role
        }

        const accessToken = this._jwtService.signAccessToken(payload);
        const refreshToken = this._jwtService.signRefreshToken(payload);

        return AuthDTOmapper.toLoginResponseDTO(user, accessToken, refreshToken);



    }
}