import { CreateInvitationDTO } from "../../dtos/invitation/requestDTOs/CreateInvitationDTO";

export interface ICreateInvitationUseCase {
    execute(dto: CreateInvitationDTO, invitedBy: string): Promise<{invitationId: string; token: string}>
}