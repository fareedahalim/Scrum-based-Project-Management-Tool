import { EpicStatus } from "../../enums/EpicStatus";
import { ProjectPriority } from "../../enums/ProjectPriority";

export interface IEpicEntity {
    _id?: string;
    projectId: string;
    name: string;
    key: string;
    description: string;
    status: EpicStatus;
    priority: ProjectPriority;
    startDate: Date | null;
    targetDate: Date | null;
    targetRelease: string | null;
    isArchived: boolean;
    archivedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date; 
}