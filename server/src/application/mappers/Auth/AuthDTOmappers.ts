import { IUserEntity } from "../../../domain/entities/User/IUserEntity";
import { LoginResponseDTO } from "../../dtos/auth/responseDTOs/LoginResponseDTO";
import { RefreshTokenResponseDTO } from "../../dtos/auth/responseDTOs/RefreshTokenResponseDTO";

export class AuthDTOmapper {
    static toLoginResponseDTO(
        user: IUserEntity,
        accessToken: string,
        refreshToken: string
    ): LoginResponseDTO {

    return {
        accessToken,
        refreshToken,
        user: {
        id: user._id!,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email,
        phone: user.phone ?? "",
        role: user.role,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        profileImage: user.profileImage,
      },
    }
    }

    static toRefreshTokenResponseDTO(
    user: IUserEntity,
    accessToken: string
): RefreshTokenResponseDTO {
    return {
        accessToken,
        user: {
            id: user._id!,
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            email: user.email,
            phone: user.phone ?? "",
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            profileImage: user.profileImage,
        },
    };
}

}