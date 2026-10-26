
import type {
  InvitationSearchParams,
  PaginatedInvitations,
} from "../../../domain/interfaces/repositories/Invitation/IInvitationRepository";

export interface IGetInvitationsUseCase {
  execute(
    params: InvitationSearchParams
  ): Promise<PaginatedInvitations>;
}
