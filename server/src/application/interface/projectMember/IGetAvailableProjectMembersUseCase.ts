
import { AvailableProjectMemberDTO } from "../../dtos/projectMember/responseDTOs/AvailableProjectMemberDTO";

export interface IGetAvailableProjectMembersUseCase {
    execute(projectId: string): Promise<AvailableProjectMemberDTO[]>;
}
