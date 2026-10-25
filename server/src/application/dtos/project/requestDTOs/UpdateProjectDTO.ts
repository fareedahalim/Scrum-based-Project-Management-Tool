import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";
import { ProjectStatus } from "../../../../domain/enums/ProjectStatus";

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  priority?: ProjectPriority;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string | null;
  teamId?: string;
}