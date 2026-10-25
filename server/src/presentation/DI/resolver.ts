import { container } from "tsyringe";
import { ContainerSetup } from "./container";
import { AuthController } from "../controllers/auth/AuthController";
import { AuthMiddleware } from "../middlewares/auth/authMiddleware";
import { OrganizationController } from "../controllers/organization/OrganizationController";
import { UserController } from "../controllers/user/UserController";
import { InvitationController } from "../controllers/invitation/InvitationController";
import { TeamController } from "../controllers/team/TeamController";
import { ProjectController } from "../controllers/project/ProjectController";
import { StoryController } from "../controllers/story/StoryController";
import { EpicController } from "../controllers/epic/EpicController";

ContainerSetup.registerAll();

export const authController = container.resolve(AuthController);
export const authMiddleware = container.resolve(AuthMiddleware);
export const organizationController = container.resolve(OrganizationController);
export const userController = container.resolve(UserController);
export const invitationController = container.resolve(InvitationController);
export const teamController = container.resolve(TeamController);
export const projectController = container.resolve(ProjectController);
export const storyController = container.resolve(StoryController);
export const epicController = container.resolve(EpicController);