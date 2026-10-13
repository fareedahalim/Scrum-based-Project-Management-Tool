import { UserRoles } from "../../enums/UserRole";

export interface JwtPayload {
    userId : string;
    role: UserRoles
}