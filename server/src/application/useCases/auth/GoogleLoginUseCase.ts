import { inject, injectable } from "tsyringe";

import { IGoogleLoginUseCase } from "../../interface/auth/IGoogleLoginUseCase";
import { GoogleLoginDTO } from "../../dtos/auth/requestDTOs/GoogleLoginDTO";

import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";
import { IJwtService } from "../../../domain/interfaces/services/IJwtService";

import { UserRoles } from "../../../domain/enums/UserRole";

import {
  ERROR_MESSAGES,
  USER_ERRORS,
} from "../../../domain/constants/errorMessages";

import { AuthDTOmapper } from "../../mappers/Auth/AuthDTOmappers";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,

    @inject("IGoogleAuthService")
    private _googleAuthService: IGoogleAuthService,

    @inject("IJwtService")
    private _jwtService: IJwtService
  ) {}

  async execute(dto: GoogleLoginDTO) : Promise<LoginResponseDTO>{
    // 1. Verify authorization code with Google
    const googleUser =
      await this._googleAuthService.verifyCode(dto.code);

    // 2. Find existing user using Google email
    let user = await this._userRepository.findByEmail(
      googleUser.email
    );

    // 3. If user doesn't exist, create a new user
    if (!user) {
      user = await this._userRepository.createUser({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,

        phone: undefined,
        password: undefined,

        googleId: googleUser.googleId,

        role: UserRoles.ADMIN,

        isActive: true,
        isEmailVerified: true,

        profileImage: googleUser.profileImage,
      });
    } else {
      // 4. Existing user checks

      if (!user.isActive) {
        throw new Error(USER_ERRORS.USER_NOT_ACTIVE);
      }

      // 5. If the existing account doesn't have googleId,
      // connect this Google account to the existing account.
      if (!user.googleId) {
        user =
          (await this._userRepository.updateUser(
            user._id!,
            {
              googleId: googleUser.googleId,
              isEmailVerified: true,
              profileImage:
                user.profileImage ??
                googleUser.profileImage,
            }
          )) ?? user;
      }
    }

    // 6. Make sure user ID exists
    if (!user._id) {
      throw new Error(USER_ERRORS.USER_ID_MISSING);
    }

    // 7. Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
    };

    // 8. Generate access token
    const accessToken =
      this._jwtService.signAccessToken(payload);

    // 9. Generate refresh token
    const refreshToken =
      this._jwtService.signRefreshToken(payload);

    // 10. Return same response structure as normal login
    return AuthDTOmapper.toLoginResponseDTO(
      user,
      accessToken,
      refreshToken
    );
  }
}