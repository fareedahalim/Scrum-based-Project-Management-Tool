import { UserRoles } from "../../../../domain/enums/UserRole";

export interface UserResponseDTO {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRoles;
  isActive: boolean;
  isEmailVerified: boolean;
  profileImage?: string;
  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}