import { UserRoles } from "../../../../domain/enums/UserRole";

export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;

    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role : UserRoles;
        isActive: boolean;
        isEmailVerified: boolean;
        profileImage?: string;
    }
}