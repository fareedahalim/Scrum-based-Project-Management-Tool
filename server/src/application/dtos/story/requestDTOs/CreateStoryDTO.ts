
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

import { IAcceptenceCriterion } from "../../../../domain/entities/Story/IStoryEntity";

export interface CreateStoryDTO {
    projectId: string;
    epicId: string;
    title: string;
    description: string;
    priority?: ProjectPriority;
    storyPoints?: number | null;
    acceptanceCriteria?: IAcceptenceCriterion[];
    labels?: string[];
}
