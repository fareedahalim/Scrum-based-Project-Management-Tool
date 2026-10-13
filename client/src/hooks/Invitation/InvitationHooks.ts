import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  acceptInvitation,
  cancelInvitation,
  createInvitation,
  getInvitations,
  resendInvitation,
} from "../../services/Invitation/invitationService";

// Create invitation
export const useCreateInvitation = () => {
  return useMutation({
    mutationFn: createInvitation,
  });
};

// Get invitations
export const useGetInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: getInvitations,
  });
};

// Accept invitation
export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: acceptInvitation,
  });
};

// Resend invitation
export const useResendInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resendInvitation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
    },
  });
};

// Cancel invitation
export const useCancelInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelInvitation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invitations"],
      });
    },
  });
};