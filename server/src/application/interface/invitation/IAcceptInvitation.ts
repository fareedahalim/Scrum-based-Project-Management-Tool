import { AcceptInvitationDTO } from "../../dtos/invitation/requestDTOs/AcceptInvitationDTO";

export interface IAcceptInvitationUseCase {
    execute(dto: AcceptInvitationDTO): Promise<void>;
}