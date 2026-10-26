import crypto from "crypto";
import { inject, injectable } from "tsyringe";

import { IInvitationRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";
import { IInvitationRedisRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";

import { IEmailService } from "../../../domain/interfaces/services/IEmailService";
import { IResendInvitationUseCase } from "../../interface/invitation/IResendInvitationUseCase";
import { env } from "../../../config/env";

@injectable()
export class ResendInvitationUseCase
  implements IResendInvitationUseCase
{
  constructor(
    @inject("IInvitationRepository")
    private readonly _invitationRepo: IInvitationRepository,

    @inject("IInvitationRedisRepository")
    private readonly _invitationRedisRepo: IInvitationRedisRepository,

    @inject("IEmailService")
    private readonly _emailService: IEmailService
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Find invitation
    const invitation =
      await this._invitationRepo.findById(id);

    if (!invitation) {
      throw new Error(
        "Invitation not found"
      );
    }

    // 2. Only pending invitations can be resent
    const now = new Date();

if (
  invitation.status !== "EXPIRED" &&
  !(
    invitation.status === "PENDING" &&
    invitation.expiresAt <= now
  )
) {
  throw new Error(
    "Only expired invitations can be resent"
  );
}

    // 3. Generate new token
    const token =
      crypto.randomBytes(32).toString("hex");

    // 4. New expiry = 24 hours
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    // 5. Update MongoDB expiry
    await this._invitationRepo.updateExpiry(
      id,
      expiresAt
    );
await this._invitationRedisRepo
  .deleteTokenByInvitationId(id);
    // 6. Store NEW token in Redis
    await this._invitationRedisRepo.saveToken(
      token,
      invitation.email,
      id,
      24 * 60 * 60
    );

    
  // 7. Create the complete frontend invitation URL
    const invitationLink =
      `${env.CLIENT_URL}/invite/${token}`;

    // 8. Send complete invitation link
    await this._emailService.sendInvitation(
      invitation.email,
      invitationLink
    );
  }
}