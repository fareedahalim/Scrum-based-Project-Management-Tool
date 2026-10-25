
import { UserRoles } from "../../../../domain/enums/UserRole";

export interface AvailableProjectMemberDTO {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    role: UserRoles;
}
