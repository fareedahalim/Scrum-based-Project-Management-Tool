
import { EpicStatus } from "../../../../domain/enums/EpicStatus";
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

export interface UpdateEpicDTO {
    name?: string;
    description?: string;
    status?: EpicStatus;
    priority?: ProjectPriority;
    startDate?: string | null;
    targetDate?: string | null;
    targetRelease?: string | null;
}
