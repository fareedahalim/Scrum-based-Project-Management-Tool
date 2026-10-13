import { useQuery } from "@tanstack/react-query";
import { addTeamMember, changeTeamLead, deleteTeam, getAvailableTeamMembers, getMyTeam, getTeamMembers, getTeams, removeTeamMember, type AddTeamMemberPayload, type ChangeTeamLeadPayload, type CreateTeamPayload, type MyTeam, type UpdateTeamPayload } from "../../services/Team/teamService";
import { getTeamById } from "../../services/Team/teamService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeam } from "../../services/Team/teamService";

import { updateTeam } from "../../services/Team/teamService";
export const useGetTeams = () => {
    return useQuery({
        queryKey: ["teams"],
        queryFn: getTeams,
    });
};


export const useGetTeamById = (teamId: string) => {
    return useQuery({
        queryKey: ["team", teamId],
        queryFn: () => getTeamById(teamId),
        enabled: Boolean(teamId),
    });
};

export const useCreateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTeamPayload) =>
            createTeam(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teams"],
            });
        },
    });
};


interface UpdateTeamVariables {
    teamId: string;
    data: UpdateTeamPayload
}

export const useUpdateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            teamId,
            data,
        }: UpdateTeamVariables) =>
            updateTeam(teamId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["teams"],
            });

            queryClient.invalidateQueries({
                queryKey: ["team", variables.teamId],
            });
        },
    });
};



interface AddTeamMemberVariables {
    teamId: string;
    data: AddTeamMemberPayload
}

export const useAddTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            teamId,
            data,
        }: AddTeamMemberVariables) =>
            addTeamMember(teamId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["team", variables.teamId],
            });

            queryClient.invalidateQueries({
                queryKey: ["team-members", variables.teamId],
            });

            queryClient.invalidateQueries({
                queryKey: ["available-team-members"],
            });
        },
    });
};


interface RemoveTeamMemberVariables {
  teamId: string;
  userId: string;
}

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: RemoveTeamMemberVariables) =>
      removeTeamMember(teamId, userId),

    onSuccess: (_, variables) => {
      // Refresh team details
      queryClient.invalidateQueries({
        queryKey: ["team", variables.teamId],
      });

      // Refresh teams list
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      // IMPORTANT:
      // Refresh the members shown inside TeamDetailsPage
      queryClient.invalidateQueries({
        queryKey: ["team-members", variables.teamId],
      });

      
      queryClient.invalidateQueries({
        queryKey: ["available-team-members"],
      });
    },
  });
};




interface ChangeTeamLeadVariables {
    teamId: string;
    data: ChangeTeamLeadPayload;
}

export const useChangeTeamLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: ChangeTeamLeadVariables) =>
      changeTeamLead(teamId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["team", variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["team-members", variables.teamId],
      });

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};

export const useGetTeamMembers = ( teamId: string) => {
    return useQuery({
        queryKey: ["team-members", teamId],
        queryFn: () => getTeamMembers(teamId),
        enabled: Boolean(teamId)
    })
}


export const useGetAvailableTeamMembers = () => {
    return useQuery({
        queryKey: ["available-team-members"],
        queryFn: getAvailableTeamMembers,
    });
};



export const useDeleteTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (teamId: string) => deleteTeam(teamId),

        onSuccess: async (_, teamId) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["teams"],
                }),

                queryClient.invalidateQueries({
                    queryKey: ["available-team-members"],
                }),

                queryClient.removeQueries({
                    queryKey: ["team", teamId],
                }),

                queryClient.removeQueries({
                    queryKey: ["team-members", teamId],
                }),
            ]);
        },
    });
};

export const useGetMyTeam = () => {
  return useQuery<MyTeam | null>({
    queryKey: ["my-team"],
    queryFn: getMyTeam,
  });
};