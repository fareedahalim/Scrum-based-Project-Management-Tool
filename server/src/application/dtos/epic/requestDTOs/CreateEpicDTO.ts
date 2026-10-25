
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

export interface CreateEpicDTO {
    projectId: string;
    name: string;
    key: string;
    description: string;
    priority?: ProjectPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}
