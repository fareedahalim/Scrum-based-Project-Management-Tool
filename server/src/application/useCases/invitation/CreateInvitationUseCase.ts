import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { ICreateInvitationUseCase } from "../../interface/invitation/ICreateInvitationUseCase";
import { IInvitationRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";
import { IInvitationRedisRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";
import { IEmailService } from "../../../domain/interfaces/services/IEmailService";

import { CreateInvitationDTO } from "../../dtos/invitation/requestDTOs/CreateInvitationDTO";

import {
  INVITATION_ERRORS,
  USER_ERRORS,
} from "../../../domain/constants/errorMessages";

import { env } from "../../../config/env";

@injectable()
export class CreateInvitationUseCase
  implements ICreateInvitationUseCase
{
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository,

    @inject("IInvitationRedisRepository")
    private _invitationRedisRepo: IInvitationRedisRepository,

    @inject("IUserRepository")
    private _userRepo: IUserRepository,

    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(
    dto: CreateInvitationDTO,
    invitedBy: string
  ): Promise<{
    invitationId: string;
    token: string;
  }> {
    const email = dto.email.trim().toLowerCase();

    const existingUser =
      await this._userRepo.findByEmail(email);

    if (existingUser) {
      throw new Error(USER_ERRORS.USER_ALREADY_EXISTS);
    }

    const existingInvitation =
      await this._invitationRepo.findPendingByEmail(email);

    if (existingInvitation) {
      throw new Error(
        INVITATION_ERRORS.PENDING_INVITATION_EXIST
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const invitation =
      await this._invitationRepo.createInvitation({
        email,
        role: "MEMBER",
        invitedBy,
        expiresAt,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const invitationId = invitation._id;

    if (!invitationId) {
      throw new Error("Invitation ID was not generated");
    }

    await this._invitationRedisRepo.saveToken(
      token,
      email,
      invitationId,
      24 * 60 * 60
    );

    const invitationLink =
      `${env.CLIENT_URL}/invite/${token}`;

    await this._emailService.sendInvitation(
      email,
      invitationLink
    );

    return {
      invitationId,
      token,
    };
  }
}