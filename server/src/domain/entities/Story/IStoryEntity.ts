import { ProjectPriority } from "../../enums/ProjectPriority";
import { StoryStatus } from "../../enums/StoryStatus";

export interface IAcceptenceCriterion {
    id: string;
    description: string;
    isCompleted: boolean;
}

export interface IStoryEntity {
    _id?: string;
    projectId: string;
    epicId: string;
    key: string;
    title: string;
    description: string;
    priority: ProjectPriority;
    storyPoints: number | null;
    status: StoryStatus;
    acceptanceCriteria: IAcceptenceCriterion[];
    labels: string[];
    isArchived: boolean;
    archivedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}