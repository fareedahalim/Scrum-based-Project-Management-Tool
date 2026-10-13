import { UserResponseDTO } from "../../application/dtos/user/responseDTOs/UserResponseDTO";
import { IUserEntity } from "../../domain/entities/User/IUserEntity";
import { UserDocument } from "../database/models/User/UserModel";

export class UserMapper {
  static toEntity(doc: UserDocument): IUserEntity {
    return {
      _id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      password: doc.password,
      googleId: doc.googleId,
      role: doc.role,
      isActive: doc.isActive,
      isEmailVerified: doc.isEmailVerified,
      profileImage: doc.profileImage,
      lastActive: doc.lastActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponse(entity: IUserEntity): UserResponseDTO {
    return {
      _id: entity._id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      role: entity.role,
      isActive: entity.isActive,
      isEmailVerified: entity.isEmailVerified,
      profileImage: entity.profileImage,
      lastActive: entity.lastActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}