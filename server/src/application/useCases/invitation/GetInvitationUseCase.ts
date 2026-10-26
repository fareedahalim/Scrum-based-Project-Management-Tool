
import { inject, injectable } from "tsyringe";

import {
  IInvitationRepository,
  InvitationSearchParams,
} from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";

import { IGetInvitationsUseCase } from "../../interface/invitation/IGetInvitations";

@injectable()
export class GetInvitationsUseCase
  implements IGetInvitationsUseCase {
  constructor(
    @inject("IInvitationRepository")
    private _invitationRepo: IInvitationRepository
  ) { }

  async execute(params: InvitationSearchParams) {
    return this._invitationRepo.getAllInvitations(params);
  }
}
