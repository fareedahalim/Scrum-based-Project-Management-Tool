
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateProjectUseCase } from "../../../application/interface/project/ICreateProjectUseCase";
import { IUpdateProjectUseCase } from "../../../application/interface/project/IUpdateProjectUseCase";
import { IGetProjectByIdUseCase } from "../../../application/interface/project/IGetProjectByIdUseCase";
// import { IGetAllProjectsUseCase } from "../../../application/interface/project/IGetAllProjectsUseCase";
import { IArchiveProjectUseCase } from "../../../application/interface/project/IArchiveProjectUseCase";

// import { CreateProjectDTO } from "../../../application/dtos/project/CreateProjectDTO";
// import { UpdateProjectDTO } from "../../../application/dtos/project/UpdateProjectDTO";

import { MESSAGES } from "../../../domain/constants/messages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { PROJECT_ERRORS } from "../../../domain/constants/errorMessages";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import { IGetAllProjectsUseCase } from "../../../application/interface/project/IGetAllProjectUseCase";
import { CreateProjectDTO } from "../../../application/dtos/project/requestDTOs/CreateProjectDTO";
import { UpdateProjectDTO } from "../../../application/dtos/project/requestDTOs/UpdateProjectDTO";
import { IGetProjectMembersUseCase } from "../../../application/interface/project/IGetProjectMembersUseCase";
import { IAddProjectMemberUseCase } from "../../../application/interface/projectMember/IAddProjectMemberUseCase";
import { AddProjectMemberDTO } from "../../../application/dtos/projectMember/requestDTOs/AddProjectMemberDTO";
import { IUpdateProjectMemberUseCase } from "../../../application/interface/projectMember/IUpdateProjectMemberUseCase";
import { ProjectScrumRole } from "../../../domain/enums/ProjectScrumRole";
import { IRemoveProjectMemberUseCase } from "../../../application/interface/projectMember/IRemoveProjectMemberUseCase";
import { IGetAvailableProjectMembersUseCase } from "../../../application/interface/projectMember/IGetAvailableProjectMembersUseCase";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class ProjectController {
    constructor(
        @inject("ICreateProjectUseCase")
        private readonly _createProjectUseCase: ICreateProjectUseCase,

        @inject("IUpdateProjectUseCase")
        private readonly _updateProjectUseCase: IUpdateProjectUseCase,

        @inject("IGetProjectByIdUseCase")
        private readonly _getProjectByIdUseCase: IGetProjectByIdUseCase,

        @inject("IGetAllProjectsUseCase")
        private readonly _getAllProjectsUseCase: IGetAllProjectsUseCase,

        @inject("IArchiveProjectUseCase")
        private readonly _archiveProjectUseCase: IArchiveProjectUseCase,

        @inject("IGetProjectMembersUseCase")
        private readonly _getProjectMembersUseCase: IGetProjectMembersUseCase,

        @inject("IAddProjectMemberUseCase")
        private readonly _addProjectMemberUseCase: IAddProjectMemberUseCase,

        @inject("IUpdateProjectMemberUseCase")
        private readonly _updateProjectMemberUseCase: IUpdateProjectMemberUseCase,

        @inject("IRemoveProjectMemberUseCase")
        private readonly _removeProjectMemberUseCase: IRemoveProjectMemberUseCase,

        @inject("IGetAvailableProjectMembersUseCase")
        private readonly _getAvailableProjectMembersUseCase: IGetAvailableProjectMembersUseCase,

    ) { }

    // Create Project
    createProject = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const dto: CreateProjectDTO = req.body;
            const createdBy = req.user!.userId;

            const project =
                await this._createProjectUseCase.execute(
                    dto,
                    createdBy
                );

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.PROJECT.PROJECT_CREATED_SUCCESSFULLY,
                data: project,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : PROJECT_ERRORS.PROJECT_CREATION_FAILED;

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Get All Projects
    getAllProjects = async (
        _req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projects =
                await this._getAllProjectsUseCase.execute();

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.PROJECT.PROJECTS_FETCHED_SUCCESSFULLY,
                data: projects,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : PROJECT_ERRORS.PROJECTS_FETCH_FAILED;

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Get Project By ID
    getProjectById = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;

            const project =
                await this._getProjectByIdUseCase.execute(projectId);

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.PROJECT.PROJECT_FETCHED_SUCCESSFULLY,
                data: project,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : PROJECT_ERRORS.PROJECT_FETCH_FAILED;

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(status).json({ message });
        }
    };

    // Update Project
    updateProject = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;
            const dto: UpdateProjectDTO = req.body;

            const project =
                await this._updateProjectUseCase.execute(
                    projectId,
                    dto
                );

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.PROJECT.PROJECT_UPDATED_SUCCESSFULLY,
                data: project,
            });
        } catch (error) {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }

    console.error("Update project failed:", error);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error.",
    });
}
    };

    // Archive Project
    archiveProject = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;

            const project =
                await this._archiveProjectUseCase.execute(projectId);

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.PROJECT.PROJECT_ARCHIVED_SUCCESSFULLY,
                data: project,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : PROJECT_ERRORS.PROJECT_ARCHIVE_FAILED;

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(status).json({ message });
        }
    };

    // Get Project Members
    getProjectMembers = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;

            const members =
                await this._getProjectMembersUseCase.execute(projectId);

            res.status(HTTP_STATUS.OK).json({
                message: "Project members fetched successfully",
                data: members,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : PROJECT_ERRORS.PROJECT_FETCH_FAILED;

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            res.status(status).json({ message });
        }
    };

    // Add Project Member
    addProjectMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;
            const dto: AddProjectMemberDTO = req.body;

            const membership =
                await this._addProjectMemberUseCase.execute(
                    projectId,
                    dto
                );

            res.status(HTTP_STATUS.CREATED).json({
                message: "Project member added successfully",
                data: membership,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to add project member";

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.BAD_REQUEST;

            res.status(status).json({ message });
        }
    };

    // Update Project Member Role
    updateProjectMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;
            const userId = req.params.userId as string;
            const scrumRole = req.body.scrumRole as ProjectScrumRole;

            const membership =
                await this._updateProjectMemberUseCase.execute(
                    projectId,
                    userId,
                    scrumRole
                );

            res.status(HTTP_STATUS.OK).json({
                message: "Project member role updated successfully",
                data: membership,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update project member role";

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.BAD_REQUEST;

            res.status(status).json({ message });
        }
    };

    // Remove Project Member
    removeProjectMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;
            const userId = req.params.userId as string;

            await this._removeProjectMemberUseCase.execute(
                projectId,
                userId
            );

            res.status(HTTP_STATUS.OK).json({
                message: "Project member removed successfully",
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to remove project member";

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.BAD_REQUEST;

            res.status(status).json({ message });
        }
    };

    // Get Available Project Members
    getAvailableProjectMembers = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const projectId = req.params.projectId as string;

            const members =
                await this._getAvailableProjectMembersUseCase.execute(projectId);

            res.status(HTTP_STATUS.OK).json({
                message: "Available project members fetched successfully",
                data: members,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch available project members";

            const status =
                message === PROJECT_ERRORS.PROJECT_NOT_FOUND ||
                    message === "Project not found"
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.BAD_REQUEST;

            res.status(status).json({ message });
        }
    };


}
