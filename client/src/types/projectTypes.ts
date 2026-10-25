
export type ProjectPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "CRITICAL";

export type ProjectStatus =
    | "PLANNING"
    | "ACTIVE"
    | "ON_HOLD"
    | "COMPLETED"
    | "ARCHIVED";


    
export interface Project {
    id: string;
    name: string;
    key: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: string;
    endDate: string | null;
    teamId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
