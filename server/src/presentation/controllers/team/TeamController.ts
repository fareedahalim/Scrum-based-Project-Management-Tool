
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateTeamUseCase } from "../../../application/interface/team/ICreateTeamUseCase";
import { IGetTeamsUseCase } from "../../../application/interface/team/IGetTeamsUseCase";
import { IGetTeamByIdUseCase } from "../../../application/interface/team/IGetTeamByIdUseCase";
import { IUpdateTeamUseCase } from "../../../application/interface/team/IUpdateTeamUseCase";
import { IAddTeamMemberUseCase } from "../../../application/interface/team/IAddTeamMemberUseCase";
import { IRemoveTeamMemberUseCase } from "../../../application/interface/team/IRemoveTeamMemberUseCase";
import { IChangeTeamLeadUseCase } from "../../../application/interface/team/IChangeTeamLeadUseCase";
import { IGetTeamMembersUseCase } from "../../../application/interface/team/IGetTeamMembersUseCase";
import { IGetAvailableTeamMembersUseCase } from "../../../application/interface/team/IGetAvailableTeamMeamberUseCase";
import { IDeleteTeamUseCase } from "../../../application/interface/team/IDeleteTeamUseCase";
import { IGetMyTeamUseCase } from "../../../application/interface/team/IGetMyTeamUseCase";

import { CreateTeamDTO } from "../../../application/dtos/team/requestDTOs/CreateTeamDTO";
import { UpdateTeamDTO } from "../../../application/dtos/team/requestDTOs/UpdateTeamDTO";
import { AddTeamMemberDTO } from "../../../application/dtos/team/requestDTOs/AddTeamMemberDTO";
import { ChangeTeamLeadDTO } from "../../../application/dtos/team/requestDTOs/ChangeTeamLeadDTO";

import { MESSAGES } from "../../../domain/constants/messages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import logger from "../../../config/logger";

@injectable()
export class TeamController {
    constructor(
        @inject("ICreateTeamUseCase")
        private _createTeamUseCase: ICreateTeamUseCase,

        @inject("IGetTeamsUseCase")
        private _getTeamsUseCase: IGetTeamsUseCase,

        @inject("IGetTeamByIdUseCase")
        private _getTeamByIdUseCase: IGetTeamByIdUseCase,

        @inject("IUpdateTeamUseCase")
        private _updateTeamUseCase: IUpdateTeamUseCase,

        @inject("IAddTeamMemberUseCase")
        private _addTeamMemberUseCase: IAddTeamMemberUseCase,

        @inject("IRemoveTeamMemberUseCase")
        private _removeTeamMemberUseCase: IRemoveTeamMemberUseCase,

        @inject("IChangeTeamLeadUseCase")
        private _changeTeamLeadUseCase: IChangeTeamLeadUseCase,

        @inject("IGetTeamMembersUseCase")
        private readonly _getTeamMembersUseCase: IGetTeamMembersUseCase,

        @inject("IGetAvailableTeamMembersUseCase")
        private readonly _getAvailableTeamMembersUseCase: IGetAvailableTeamMembersUseCase,

        @inject("IDeleteTeamUseCase")
        private readonly _deleteTeamUseCase: IDeleteTeamUseCase,

        @inject("IGetMyTeamUseCase")
        private readonly _getMyTeamUseCase: IGetMyTeamUseCase
    ) {}

    // Create Team
    createTeam = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: CreateTeamDTO = req.body;

            const team = await this._createTeamUseCase.execute(dto);

            logger.info("Team created successfully");

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.TEAM.TEAM_CREATED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_CREATION_FAILED;

            logger.error("Failed to create team", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Get Teams
    getTeams = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const role = req.user!.role;

            const teams = await this._getTeamsUseCase.execute(
                userId,
                role
            );

            logger.info("Teams fetched successfully", {
                userId,
                role,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAMS_FETCHED_SUCCESSFULLY,
                data: teams,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAMS_FETCH_FAILED;

            logger.error("Failed to fetch teams", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Get Team By ID
    getTeamById = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            const userId = req.user!.userId;
            const role = req.user!.role;

            const team = await this._getTeamByIdUseCase.execute(
                teamId,
                userId,
                role
            );

            logger.info("Team fetched successfully", {
                teamId,
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAM_FETCHED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_FETCH_FAILED;

            logger.error("Failed to fetch team", {
                teamId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Update Team
    updateTeam = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            const dto: UpdateTeamDTO = req.body;

            const team = await this._updateTeamUseCase.execute(
                teamId,
                dto
            );

            logger.info("Team updated successfully", {
                teamId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAM_UPDATED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_UPDATION_FAILED;

            logger.error("Failed to update team", {
                teamId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Add Team Member
    addTeamMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            const dto: AddTeamMemberDTO = req.body;

            await this._addTeamMemberUseCase.execute(
                teamId,
                dto
            );

            logger.info("Team member added successfully", {
                teamId,
            });

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.TEAM.TEAM_MEMBER_ADDED_SUCCESSFULLY,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_MEMBER_ADD_FAILED;

            logger.error("Failed to add team member", {
                teamId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Remove Team Member
    removeTeamMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;
        const userId = req.params.userId as string;

        try {
            await this._removeTeamMemberUseCase.execute(
                teamId,
                userId
            );

            logger.info("Team member removed successfully", {
                teamId,
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAM_MEMBER_REMOVED_SUCCESSFULLY,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_MEMBER_REMOVE_FAILED;

            logger.error("Failed to remove team member", {
                teamId,
                userId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Change Team Lead
    changeTeamLead = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            const dto: ChangeTeamLeadDTO = req.body;

            await this._changeTeamLeadUseCase.execute(
                teamId,
                dto
            );

            logger.info("Team lead changed successfully", {
                teamId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAM_LEAD_CHANGED_SUCCESSFULLY,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_LEAD_CHANGE_FAILED;

            logger.error("Failed to change team lead", {
                teamId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Get Team Members
    getTeamMembers = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            const members =
                await this._getTeamMembersUseCase.execute(teamId);

            logger.info("Team members fetched successfully", {
                teamId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.TEAM.TEAM_MEMBERS_FETCHED,
                data: members,
            });
        } catch (error) {
            logger.error("Failed to fetch team members", {
                teamId,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            next(error);
        }
    };

    // Get Available Team Members
    getAvailableTeamMembers = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const users =
                await this._getAvailableTeamMembersUseCase.execute();

            logger.info("Available team members fetched successfully", {
                count: users.length,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "Available team members fetched successfully",
                data: users,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch available team members";

            logger.error("Failed to fetch available team members", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // Delete Team
    deleteTeam = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const teamId = req.params.teamId as string;

        try {
            await this._deleteTeamUseCase.execute(teamId);

            logger.info("Team deleted successfully", {
                teamId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "Team deleted successfully",
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to delete team";

            const status =
                message === TEAM_ERRORS.TEAM_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.NOT_FOUND) {
                logger.warn("Team not found during deletion", {
                    teamId,
                    error: message,
                });
            } else {
                logger.error("Failed to delete team", {
                    teamId,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    // Get My Team
    getMyTeam = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const userId = req.user!.userId;

        try {
            const team = await this._getMyTeamUseCase.execute(userId);

            logger.info("User team fetched successfully", {
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "My team fetched successfully",
                data: team,
            });
        } catch (error) {
            logger.error("Failed to fetch user's team", {
                userId,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            next(error);
        }
    };
}