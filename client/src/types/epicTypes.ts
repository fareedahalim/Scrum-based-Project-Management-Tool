
export type EpicStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "COMPLETED";

export type EpicPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

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

export interface CreateEpicDTO {
    name: string;
    key: string;
    description: string;
    priority?: EpicPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}

export interface UpdateEpicDTO {
    name?: string;
    description?: string;
    status?: EpicStatus;
    priority?: EpicPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}

export interface GetEpicsOptions {
    includeArchived?: boolean;
}
