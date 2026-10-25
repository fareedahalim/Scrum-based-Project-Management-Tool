import { ProjectScrumRole } from "../../../../domain/enums/ProjectScrumRole";

export interface AddProjectMemberDTO {
  userId: string;
  scrumRole: ProjectScrumRole;
}