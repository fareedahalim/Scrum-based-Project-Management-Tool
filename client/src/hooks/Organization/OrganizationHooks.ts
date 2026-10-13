import {
  
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createOrganization,
  getOrganization,
  updateOrganization,
} from "../../services/Organization/organizationService";


export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organization"],
      });
    },
  });
};



export const useGetOrganization = (
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
    retry: false,
    enabled: options?.enabled ?? true,
  });
};


export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organization"],
      });
    },
  });
};