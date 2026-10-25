
import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export type ProjectScrumRole =
    | "PRODUCT_OWNER"
    | "SCRUM_MASTER"
    | "DEVELOPER";

export type ProjectMemberStatus =
    | "ACTIVE"
    | "COMPLETED"
    | "REMOVED";

export type ProjectMembershipSource =
    | "TEAM"
    | "INDIVIDUAL";

export interface ProjectMember {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
    role: string;
    scrumRole: ProjectScrumRole;
    status: ProjectMemberStatus;
    membershipSource: ProjectMembershipSource;
}

export interface ProjectMembersResponse {
    projectId: string;
    projectName: string;
    members: ProjectMember[];
}

export interface AvailableProjectMember {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    role: string;
}

export interface AddProjectMemberPayload {
    userId: string;
    scrumRole: ProjectScrumRole;
}

export interface UpdateProjectMemberRolePayload {
    scrumRole: ProjectScrumRole;
}

export const getProjectMembers = async (
    projectId: string
): Promise<ProjectMembersResponse> => {
    const response = await AxiosInstance.get(
        API_ROUTES.PROJECT.GET_PROJECT_MEMBERS(projectId)
    );

    return response.data.data as ProjectMembersResponse;
};

export const getAvailableProjectMembers = async (
    projectId: string
): Promise<AvailableProjectMember[]> => {
    const response = await AxiosInstance.get(
        API_ROUTES.PROJECT.GET_AVAILABLE_MEMBERS(projectId)
    );

    return response.data.data as AvailableProjectMember[];
};

export const addProjectMember = async (
    projectId: string,
    payload: AddProjectMemberPayload
) => {
    const response = await AxiosInstance.post(
        API_ROUTES.PROJECT.ADD_PROJECT_MEMBERS(projectId),
        payload
    );

    return response.data.data;
};

export const updateProjectMemberRole = async (
    projectId: string,
    userId: string,
    payload: UpdateProjectMemberRolePayload
) => {
    const response = await AxiosInstance.patch(
        API_ROUTES.PROJECT.UPDATE_SCRUM_ROLE(projectId, userId),
        payload
    );

    return response.data.data;
};

export const removeProjectMember = async (
    projectId: string,
    userId: string
) => {
    const response = await AxiosInstance.delete(
        API_ROUTES.PROJECT.REMOVE_PROJECT_MEMBER(projectId, userId)
    );

    return response.data;
};
