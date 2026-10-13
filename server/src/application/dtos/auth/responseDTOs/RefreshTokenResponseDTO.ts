import { UserRoles } from "../../../../domain/enums/UserRole";

export interface RefreshTokenResponseDTO {
    accessToken: string;
    

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