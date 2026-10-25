
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";
import { StoryStatus } from "../../../../domain/enums/StoryStatus";

import { IAcceptenceCriterion } from "../../../../domain/entities/Story/IStoryEntity";

export interface UpdateStoryDTO {
    title?: string;
    description?: string;
    priority?: ProjectPriority;
    storyPoints?: number | null;
    status?: StoryStatus;
    acceptanceCriteria?: IAcceptenceCriterion[];
    labels?: string[];
}
