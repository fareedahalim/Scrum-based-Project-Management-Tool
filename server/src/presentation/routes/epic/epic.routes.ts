
import { Router } from "express";

import {
    authMiddleware,
    epicController,
} from "../../DI/resolver";

import { ROUTES } from "../../../shared/constant/routes";
import { validateRequest } from "../../middlewares/validator";


import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { createEpicSchema, updateEpicSchema } from "../../validation/epic.validation";

const router = Router();

// Create Epic — Product Owner only
router.post(
    ROUTES.EPIC.CREATE_EPIC,
    authMiddleware.authenticate,
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    validateRequest(createEpicSchema),
    epicController.createEpic
);

// Get Epics By Project — active project members
router.get(
    ROUTES.EPIC.GET_EPICS_BY_PROJECT,
    authMiddleware.authenticate,
    authMiddleware.authorizeProjectAccess,
    epicController.getEpicsByProject
);

// Update Epic — Product Owner only
router.patch(
    ROUTES.EPIC.UPDATE_EPIC,
    authMiddleware.authenticate,
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    validateRequest(updateEpicSchema),
    epicController.updateEpic
);

// Archive Epic — Product Owner only
router.patch(
    ROUTES.EPIC.ARCHIVE_EPIC,
    authMiddleware.authenticate,
    authMiddleware.authorizeProjectRole(
        ProjectScrumRole.PRODUCT_OWNER
    ),
    epicController.archiveEpic
);

export default router;
