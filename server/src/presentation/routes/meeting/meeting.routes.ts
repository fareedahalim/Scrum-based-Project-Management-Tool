import { Router } from "express";

import {
    authMiddleware,
    sprintPlanningMeetingController,
} from "../../DI/resolver";

import { ROUTES } from "../../../shared/constant/routes";
import { validateRequest } from "../../middlewares/validator";

import { createSprintPlanningMeetingSchema } from "../../validation/meeting.validation";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";

const router = Router();

// Schedule Sprint Planning Meeting — Scrum Master only

router.post(
    ROUTES.MEETING.CREATE_SPRINT_PLANNING_MEETING,
    authMiddleware.authenticate,
    validateRequest(createSprintPlanningMeetingSchema),
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.SCRUM_MASTER
    ),
    sprintPlanningMeetingController.createMeeting
);

export default router;