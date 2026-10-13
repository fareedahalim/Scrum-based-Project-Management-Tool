import { inject, injectable } from "tsyringe";

import { IInvitationRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";

import { IInvitationRedisRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRedisRepository";
import { ICancelInvitationUseCase } from "../../interface/invitation/ICancelInvitationUseCase";

// import { ICancelInvitationUseCase } from "../../interface/invitation/ICancelInvitation";

@injectable()
export class CancelInvitationUseCase
  implements ICancelInvitationUseCase
{
  constructor(
    @inject("IInvitationRepository")
    private readonly _invitationRepo: IInvitationRepository,

    @inject("IInvitationRedisRepository")
    private readonly _invitationRedisRepo: IInvitationRedisRepository
  ) {}

  async execute(id: string): Promise<void> {
    const invitation =
      await this._invitationRepo.findById(id);

    if (!invitation) {
      throw new Error(
        "Invitation not found"
      );
    }

    if (invitation.status !== "PENDING") {
      throw new Error(
        "Only pending invitations can be cancelled"
      );
    }

    await this._invitationRepo.updateStatus(
      id,
      "CANCELLED"
    );

    await this._invitationRedisRepo
      .deleteTokenByInvitationId(id);
  }
}