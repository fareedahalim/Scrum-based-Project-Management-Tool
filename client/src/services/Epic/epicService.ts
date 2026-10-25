import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export type EpicStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED";

export type EpicPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Epic {
    _id: string;
    projectId: string;
    name: string;
    key: string;
    description: string;
    status: EpicStatus;
    priority: EpicPriority;
    startDate: string | null;
    targetDate: string | null;
    targetRelease: string | null;
    isArchived: boolean;
    archivedAt: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEpicPayload {
    name: string;
    key: string;
    description: string;
    priority?: EpicPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}

export interface UpdateEpicPayload {
    name?: string;
    description?: string;
    status?: EpicStatus;
    priority?: EpicPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}

export const getEpicsByProject = async (
    projectId: string,
    includeArchived = false,
): Promise<Epic[]> => {
    const response = await AxiosInstance.get(
        API_ROUTES.EPIC.GET_EPICS_BY_PROJECT(projectId),
        {
            params: { includeArchived },
        },
    );

    return response.data.data;
};

export const createEpic = async (
    projectId: string,
    payload: CreateEpicPayload,
): Promise<Epic> => {
    const response = await AxiosInstance.post(
        API_ROUTES.EPIC.CREATE_EPIC(projectId),
        payload,
    );

    return response.data.data;
};

export const updateEpic = async (
    projectId: string,
    epicId: string,
    payload: UpdateEpicPayload,
): Promise<Epic> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.EPIC.UPDATE_EPIC(projectId, epicId),
        payload,
    );

    return response.data.data;
};

export const archiveEpic = async (
    projectId: string,
    epicId: string,
): Promise<Epic> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.EPIC.ARCHIVE_EPIC(projectId, epicId),
    );

    return response.data.data;
};