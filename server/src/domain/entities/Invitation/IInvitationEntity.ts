export interface IInvitationEntity {
    _id?: string;
    email: string;
    role: "MEMBER";
    invitedBy: string;
    expiresAt: Date;
    status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
    createdAt: Date;
    updatedAt: Date;
}