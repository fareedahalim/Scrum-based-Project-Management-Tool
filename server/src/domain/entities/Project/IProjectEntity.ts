import { ProjectPriority } from "../../enums/ProjectPriority";
import { ProjectStatus } from "../../enums/ProjectStatus";

export interface IProjectEntity {
    _id?: string;
    name: string;
    key: string;
    description: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate: Date;
    endDate: Date | null;
    teamId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}