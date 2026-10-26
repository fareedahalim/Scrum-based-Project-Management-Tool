import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type {
  GetInvitationsParams,
} from "../../types/invitationTypes";

export interface CreateInvitationPayload {
  email: string;
}

export interface AcceptInvitationPayload {
  token: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Create invitation
export const createInvitation = async (
  data: CreateInvitationPayload
) => {
    console.log("Entering to the createInvitation")
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.CREATE_INVITATION,
    data
  );
console.log("CREATE INVITATION API",response.data)
  return response.data;
};

// Get invitations

export const getInvitations = async (
  params: GetInvitationsParams
) => {
  const queryParams = {
    ...(params.search?.trim()
      ? { search: params.search.trim() }
      : {}),
    ...(params.status && params.status !== "ALL"
      ? { status: params.status }
      : {}),
    page: params.page,
    limit: params.limit,
  };

  const response = await AxiosInstance.get(
    API_ROUTES.INVITATION.GET_INVITATIONS,
    {
      params: queryParams,
    }
  );

  return response.data;
};


// Accept invitation
export const acceptInvitation = async (
  data: AcceptInvitationPayload
) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.ACCEPT_INVITATION,
    data
  );

  return response.data;
};

// Resend invitation
export const resendInvitation = async (
  id: string
) => {
  const response = await AxiosInstance.post(
    API_ROUTES.INVITATION.RESEND_INVITATION(id)
  );

  return response.data;
};

// Cancel invitation
export const cancelInvitation = async (
  id: string
) => {
  const response = await AxiosInstance.patch(
    API_ROUTES.INVITATION.CANCEL_INVITATION(id)
  );

  return response.data;
};