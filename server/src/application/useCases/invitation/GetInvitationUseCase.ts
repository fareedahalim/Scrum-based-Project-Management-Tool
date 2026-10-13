import { inject, injectable } from "tsyringe";

import { IInvitationRepository } from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";

import { IGetInvitationsUseCase } from "../../interface/invitation/IGetInvitations";

@injectable()
export class GetInvitationsUseCase
  implements IGetInvitationsUseCase
{
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository
  ) {}

  async execute() {
    return await this._invitationRepo.getAllInvitations();
  }
}