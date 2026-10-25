
import { Router } from "express";

import { authMiddleware, projectController } from "../../DI/resolver";
import { ROUTES } from "../../../shared/constant/routes";
import { validateRequest } from "../../middlewares/validator";
import {
    createProjectSchema,
    updateProjectSchema,
} from "../../validation/project.validation";
import { addProjectMemberSchema, removeProjectMemberSchema, updateProjectMemberSchema } from "../../validation/projectMember.validation";

const router = Router();

// Create Project
router.post(
    ROUTES.PROJECT.CREATE_PROJECT,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    validateRequest(createProjectSchema),
    projectController.createProject
);

// Get All Projects
router.get(
    ROUTES.PROJECT.GET_PROJECTS,
    authMiddleware.authenticate,
    projectController.getAllProjects
);

// Get Project By ID
router.get(
    ROUTES.PROJECT.GET_PROJECT_BY_ID,
    authMiddleware.authenticate,
    projectController.getProjectById
);

// Update Project
router.patch(
    ROUTES.PROJECT.UPDATE_PROJECT,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    validateRequest(updateProjectSchema),
    projectController.updateProject
);

// Archive Project
router.patch(
    ROUTES.PROJECT.ARCHIVE_PROJECT,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    projectController.archiveProject
);

// Get Project Members
router.get(
    ROUTES.PROJECT.GET_PROJECT_MEMBERS,
    authMiddleware.authenticate,
    projectController.getProjectMembers
);

router.post(
    ROUTES.PROJECT.ADD_PROJECT_MEMBERS,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    validateRequest(addProjectMemberSchema),
    projectController.addProjectMember
);

router.patch(
    ROUTES.PROJECT.UPDATE_SCRUM_ROLE,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    validateRequest(updateProjectMemberSchema),
    projectController.updateProjectMember
);

router.delete(
    "/:projectId/members/:userId",
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    validateRequest(removeProjectMemberSchema),
    projectController.removeProjectMember
);

router.get(
    ROUTES.PROJECT.GET_AVAILABLE_MEMBERS,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    projectController.getAvailableProjectMembers
);

export default router;
