import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

export interface CreateProjectDTO {
  name: string;
  key: string;
  description: string;
  priority?: ProjectPriority;
  startDate: string;
  endDate?: string | null;
  teamId: string;

  productOwnerId: string;
  scrumMasterId: string;
  additionalMemberIds?: string[];
}