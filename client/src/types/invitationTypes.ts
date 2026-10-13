export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED"
  | "CANCELLED";

export interface Invitation {
  _id: string;
  email: string;
  role: "MEMBER";
  invitedBy: string;
  expiresAt: string;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetInvitationsResponse {
  message: string;
  data: Invitation[];
}