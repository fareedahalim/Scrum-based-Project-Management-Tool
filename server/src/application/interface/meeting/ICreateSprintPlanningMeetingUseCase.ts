import { CreateSprintPlanningDTO } from "../../dtos/meeting/requestDTOs/CreateSprintPlanningMeetingDTO";

export interface ICreateSprintPlanningUseCase {
    execute(dto: CreateSprintPlanningDTO, userId: string): Promise<string>;
}