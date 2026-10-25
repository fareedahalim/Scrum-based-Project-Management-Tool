

import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { Project, ProjectPriority, ProjectStatus } from "../../types/projectTypes";


export interface CreateProjectPayload {
    name: string;
    key: string;
    description: string;
    priority?: ProjectPriority;
    startDate: string;
    endDate?: string | null;
    teamId: string;
    productOwnerId: string;
    scrumMasterId: string;
    additionalMemberIds?: string[];
}

export interface UpdateProjectPayload {
    name?: string;
    description?: string;
    priority?: ProjectPriority;
    status?: ProjectStatus;
    startDate?: string;
    endDate?: string | null;
    teamId?: string;
}

export const createProject = async (
    payload: CreateProjectPayload
) => {
    const response = await  AxiosInstance.post(API_ROUTES.PROJECT.CREATE_PROJECT, payload);

    return response.data.data;
};

export const getProjects = async (): Promise<Project[]> => {
    const response = await AxiosInstance.get(
        API_ROUTES.PROJECT.GET_PROJECTS
    );

    return response.data.data as Project[];
};

export const getProjectById = async (
    projectId: string
): Promise<Project> => {
    const response = await AxiosInstance.get(
        API_ROUTES.PROJECT.GET_PROJECT_BY_ID(projectId)
    );

    return response.data.data as Project;
};

export const updateProject = async (
    projectId: string,
    payload: UpdateProjectPayload
) => {
    const response = await AxiosInstance.patch(
        API_ROUTES.PROJECT.UPDATE_PROJECT(projectId),
        payload
    );

    return response.data.data;
};

export const archiveProject = async (projectId: string) => {
    const response = await AxiosInstance.patch(
        API_ROUTES.PROJECT.ARCHIVE_PROJECT(projectId)
    );

    return response.data.data;
};
