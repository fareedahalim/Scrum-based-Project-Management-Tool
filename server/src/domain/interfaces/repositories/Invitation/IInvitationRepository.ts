import { IInvitationEntity } from "../../../entities/Invitation/IInvitationEntity";

export interface IInvitationRepository {
    createInvitation(invitation: IInvitationEntity): Promise<IInvitationEntity>;

    findById(id: string): Promise<IInvitationEntity | null>;

    findPendingByEmail(email: string): Promise<IInvitationEntity | null>;

    updateStatus(id: string, status: IInvitationEntity["status"]): Promise<IInvitationEntity | null>;

    updateExpiry(id: string, expiresAt: Date): Promise<IInvitationEntity | null>;

    getAllInvitations(): Promise<IInvitationEntity[]>;
}