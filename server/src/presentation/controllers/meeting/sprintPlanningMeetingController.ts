import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { CreateSprintPlanningDTO } from "../../../application/dtos/meeting/requestDTOs/CreateSprintPlanningMeetingDTO";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";

import { ICreateSprintPlanningUseCase } from "../../../application/interface/meeting/ICreateSprintPlanningMeetingUseCase";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MEETING_ERRORS } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";

@injectable()
export class SprintPlanningMeetingController {
    constructor(
        @inject("ICreateSprintPlanningUseCase")
        private _createSprintPlanningUseCase: ICreateSprintPlanningUseCase,
    ) { }

    createMeeting = async (req: AuthRequest, res: Response): Promise<void> => {

        try {
            const projectId = req.params.projectId as string;

            const dto: CreateSprintPlanningDTO = {
                ...req.body,
                projectId,
            };

            const createdBy = req.user!.userId;

            const meetingId = await this._createSprintPlanningUseCase.execute(dto,
                createdBy
            );

            res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.MEETING.SPRINT_PLANNING_MEETING_SCHEDULED_SUCCESSFULLY, data: { meetingId } })
        } catch (error: any) {
            const message = error.message || "Failed to schedule sprint planning meeting";

            let status = 500;

            if (message === MEETING_ERRORS.SCRUM_MASTER_CAN_SCHEDULE_MEETING) {
                status = 403;
            } else if (message === MEETING_ERRORS.SELECT_AT_LEAST_ONE) {
                status = 400;
            }

            res.status(status).json({ message });
        }
    };
}