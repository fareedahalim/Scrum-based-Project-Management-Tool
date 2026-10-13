import { inject, injectable } from "tsyringe";

import { IInvitationRedisRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";
import { IInvitationRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";

import { AcceptInvitationDTO } from "../../dtos/invitation/requestDTOs/AcceptInvitationDTO";

import {
  INVITATION_ERRORS,
  USER_ERRORS,
  ERROR_MESSAGES,
} from "../../../domain/constants/errorMessages";
import { IAcceptInvitationUseCase } from "../../interface/invitation/IAcceptInvitation";
import { UserRoles } from "../../../domain/enums/UserRole";

@injectable()
export class AcceptInvitationUseCase
  implements IAcceptInvitationUseCase
{
  constructor(
    @inject("IInvitationRedisRepository")
    private _invitationRedisRepo: IInvitationRedisRepository,

    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository,

    @inject("IUserRepository")
    private _userRepo: IUserRepository,

    @inject("IPasswordService")
    private _passwordService: IPasswordService
  ) {}

  async execute(
    dto: AcceptInvitationDTO
  ): Promise<void> {

    // 1. Get invitation token data from Redis
    const tokenData =
      await this._invitationRedisRepo.getTokenData(dto.token);

    if (!tokenData) {
      throw new Error(
        INVITATION_ERRORS.INVITATION_INVALID_OR_EXPIRED
      );
    }

    // 2. Find invitation in MongoDB
    const invitation =
      await this._invitationRepo.findById(
        tokenData.invitationId
      );

    if (!invitation) {
      throw new Error(
        INVITATION_ERRORS.INVITATION_NOT_FOUND
      );
    }

    // 3. Check invitation status
    if (invitation.status !== "PENDING") {
      throw new Error(
        INVITATION_ERRORS.INVITATION_ALREADY_PROCESSED
      );
    }

    // 4. Check MongoDB expiry
    if (invitation.expiresAt < new Date()) {

      await this._invitationRepo.updateStatus(
        invitation._id!,
        "EXPIRED"
      );

      await this._invitationRedisRepo.deleteToken(
        dto.token
      );

      throw new Error(
        INVITATION_ERRORS.INVITATION_EXPIRED
      );
    }

    // 5. Make sure email from Redis matches invitation
    if (
      tokenData.email.toLowerCase() !==
      invitation.email.toLowerCase()
    ) {
      throw new Error(
        INVITATION_ERRORS.INVITATION_INVALID
      );
    }

    // 6. Check whether user already exists
    const existingUser =
      await this._userRepo.findByEmail(
        invitation.email
      );

    if (existingUser) {
      throw new Error(
        USER_ERRORS.USER_ALREADY_EXISTS
      );
    }

    // 7. Check password confirmation
    if (dto.password !== dto.confirmPassword) {
      throw new Error(
        ERROR_MESSAGES.PASSWORD_NOT_MATCHING
      );
    }

    // 8. Hash password
    const hashedPassword =
      await this._passwordService.hash(
        dto.password
      );

    // 9. Create MEMBER account
    await this._userRepo.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: invitation.email,
      phone: dto.phone.trim(),
      password: hashedPassword,
      role: UserRoles.MEMBER,
      isActive: true,
      isEmailVerified: true,
      profileImage: undefined,
    });

    // 10. Mark invitation as accepted
    await this._invitationRepo.updateStatus(
      invitation._id!,
      "ACCEPTED"
    );

    // 11. Remove token from Redis
    await this._invitationRedisRepo.deleteToken(
      dto.token
    );
  }
}