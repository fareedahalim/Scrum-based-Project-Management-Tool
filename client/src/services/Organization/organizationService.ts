import { data } from "react-router-dom";
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

// Create Organization

export interface CreateOrganizationPayload {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

// Update Organization
export interface UpdateOrganizationPayload {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
}

// Organization returned from backend

export interface Organization {
  id: string;
  name: string;
  logo?: string | null;
  description?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create Organization Response

export interface CreateOrganizationResponse {
  message: string;
  data: Organization;
}

// Get Organization Response

export interface GetOrganizationResponse {
  message: string;
  data: Organization;
}

// Create Organization

export const createOrganization = async (
  data: CreateOrganizationPayload
): Promise<CreateOrganizationResponse> => {
  const response = await AxiosInstance.post<CreateOrganizationResponse>(
    API_ROUTES.ORGANIZATION.CREATE,
    data
  );

  return response.data;
};

// Get Organization

export const getOrganization =
  async (): Promise<GetOrganizationResponse> => {
    const response =
      await AxiosInstance.get<GetOrganizationResponse>(
        API_ROUTES.ORGANIZATION.GET
      );

    return response.data;
  };


export const updateOrganization = async (
    data: UpdateOrganizationPayload
) => {
    console.log("Entering to the update organization aPI")
    const response = await AxiosInstance.put(
        API_ROUTES.ORGANIZATION.UPDATE,
        data
    );
    return response.data;
}