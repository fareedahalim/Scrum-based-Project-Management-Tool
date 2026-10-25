import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";
import { ProjectStatus } from "../../../../domain/enums/ProjectStatus";

export interface ProjectResponseDTO {
  id: string;
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