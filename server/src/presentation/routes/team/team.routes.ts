import { Router } from "express";

import { authMiddleware, teamController } from "../../DI/resolver";
import { ROUTES } from "../../../shared/constant/routes";
import { validateRequest } from "../../middlewares/validator";
import { addTeamMemberSchema, changeTeamLeadSchema, createTeamSchema, updateTeamSchema } from "../../validation/team.validation";

const router = Router();


// Create team
router.post(
  ROUTES.TEAM.CREATE_TEAM,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(createTeamSchema),
  teamController.createTeam
);

// Get teams
router.get(
  ROUTES.TEAM.GET_TEAMS,
  authMiddleware.authenticate,
  teamController.getTeams
);

// Get available team members
router.get(
  ROUTES.TEAM.GET_AVAILABLE_MEMBERS,
  authMiddleware.authenticate,
  teamController.getAvailableTeamMembers
);

router.get(
    ROUTES.TEAM.GET_MY_TEAM,
    authMiddleware.authenticate,
    teamController.getMyTeam

)

// Get team by ID
router.get(
  ROUTES.TEAM.GET_TEAM_BY_ID,
  authMiddleware.authenticate,
  teamController.getTeamById
);

// Update team
router.patch(
  ROUTES.TEAM.UPDATE_TEAM,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(updateTeamSchema),
  teamController.updateTeam
);

// Add team member
router.post(
  ROUTES.TEAM.ADD_TEAM_MEMBER,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(addTeamMemberSchema),
  teamController.addTeamMember
);

// Remove team member
router.delete(
  ROUTES.TEAM.REMOVE_TEAM_MEMBER,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  teamController.removeTeamMember
);

// Change team lead
router.patch(
  ROUTES.TEAM.CHANGE_TEAM_LEAD,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(changeTeamLeadSchema),
  teamController.changeTeamLead
);

router.get(
  ROUTES.TEAM.GET_TEAM_MEMBERS,
  authMiddleware.authenticate,
  teamController.getTeamMembers
);

router.delete(
    ROUTES.TEAM.DELETE_TEAM,
    authMiddleware.authenticate,
    authMiddleware.authorizeAdmin,
    teamController.deleteTeam
);




export default router;