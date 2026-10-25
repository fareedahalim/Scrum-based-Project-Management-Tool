import { Router } from "express";

import {
    authMiddleware,
    storyController,
} from "../../DI/resolver";

import { ROUTES } from "../../../shared/constant/routes";
import { validateRequest } from "../../middlewares/validator";
import {
    archiveStorySchema,
    createStorySchema,
    getStoriesByEpicSchema,
    getStoriesByProjectSchema,
    updateStorySchema,
} from "../../validation/story.validation";

import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";

const router = Router();

// Create Story — Product Owner only

router.post(
    ROUTES.STORY.CREATE_STORY,
    authMiddleware.authenticate,
    validateRequest(createStorySchema),
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    storyController.createStory
);


// Get Stories By Project — active project members

router.get(
    ROUTES.STORY.GET_STORIES_BY_PROJECT,
    authMiddleware.authenticate,
    validateRequest(getStoriesByProjectSchema),
    authMiddleware.authorizeProjectAccess,
    storyController.getStoriesByProject
);


// Get Stories By Epic — active project members

router.get(
    ROUTES.STORY.GET_STORIES_BY_EPIC,
    authMiddleware.authenticate,
    validateRequest(getStoriesByEpicSchema),
    authMiddleware.authorizeProjectAccess,
    storyController.getStoriesByEpic
);


// Update Story — Product Owner only

router.patch(
    ROUTES.STORY.UPDATE_STORY,
    authMiddleware.authenticate,
    validateRequest(updateStorySchema),
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    storyController.updateStory
);

// Archive Story — Product Owner only


router.patch(
    ROUTES.STORY.ARCHIVE_STORY,
    authMiddleware.authenticate,
    validateRequest(archiveStorySchema),
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    storyController.archiveStory
);



export default router;