import { UserRoles } from "../../enums/UserRole";

export interface IUserEntity {
  _id?: string;

  firstName: string;
  lastName: string;
  email: string;

  phone?: string;
  password?: string;

  googleId?: string;

  role: UserRoles;
  isActive: boolean;
  isEmailVerified: boolean;

  profileImage?: string;

  lastActive?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}