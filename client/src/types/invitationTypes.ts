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


export interface InvitationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetInvitationsResponse {
  message: string;
  data: Invitation[];
  pagination: InvitationPagination;
}

export interface GetInvitationsParams {
  search?: string;
  status?: InvitationStatus | "ALL";
  page: number;
  limit: number;
}
