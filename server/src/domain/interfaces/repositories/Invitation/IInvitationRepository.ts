
import { IInvitationEntity } from "../../../entities/Invitation/IInvitationEntity";

export interface InvitationSearchParams {
    search?: string;
    status?: IInvitationEntity["status"];
    page: number;
    limit: number;
}

export interface PaginatedInvitations {
    invitations: IInvitationEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IInvitationRepository {
    createInvitation(
        invitation: IInvitationEntity
    ): Promise<IInvitationEntity>;

    findById(
        id: string
    ): Promise<IInvitationEntity | null>;

    findPendingByEmail(
        email: string
    ): Promise<IInvitationEntity | null>;

    updateStatus(
        id: string,
        status: IInvitationEntity["status"]
    ): Promise<IInvitationEntity | null>;

    updateExpiry(
        id: string,
        expiresAt: Date
    ): Promise<IInvitationEntity | null>;

    getAllInvitations(
        params: InvitationSearchParams
    ): Promise<PaginatedInvitations>;
}
