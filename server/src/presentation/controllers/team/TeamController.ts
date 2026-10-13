
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateTeamUseCase } from "../../../application/interface/team/ICreateTeamUseCase";
import { IGetTeamsUseCase } from "../../../application/interface/team/IGetTeamsUseCase";
import { IGetTeamByIdUseCase } from "../../../application/interface/team/IGetTeamByIdUseCase";
import { IUpdateTeamUseCase } from "../../../application/interface/team/IUpdateTeamUseCase";
import { IAddTeamMemberUseCase } from "../../../application/interface/team/IAddTeamMemberUseCase";
import { IRemoveTeamMemberUseCase } from "../../../application/interface/team/IRemoveTeamMemberUseCase";
import { IChangeTeamLeadUseCase } from "../../../application/interface/team/IChangeTeamLeadUseCase";

import { CreateTeamDTO } from "../../../application/dtos/team/requestDTOs/CreateTeamDTO";
import { UpdateTeamDTO } from "../../../application/dtos/team/requestDTOs/UpdateTeamDTO";
import { AddTeamMemberDTO } from "../../../application/dtos/team/requestDTOs/AddTeamMemberDTO";
import { ChangeTeamLeadDTO } from "../../../application/dtos/team/requestDTOs/ChangeTeamLeadDTO";

import { MESSAGES } from "../../../domain/constants/messages";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { TEAM_ERRORS } from "../../../domain/constants/errorMessages";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import { IGetTeamMembersUseCase } from "../../../application/interface/team/IGetTeamMembersUseCase";
import { IGetAvailableTeamMembersUseCase } from "../../../application/interface/team/IGetAvailableTeamMeamberUseCase";
import { IDeleteTeamUseCase } from "../../../application/interface/team/IDeleteTeamUseCase";
import { IGetMyTeamUseCase } from "../../../application/interface/team/IGetMyTeamUseCase";

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

        @inject("IGetTeamMembersUseCase") private readonly _getTeamMembersUseCase: IGetTeamMembersUseCase,

        @inject("IGetAvailableTeamMembersUseCase") private readonly _getAvailableTeamMembersUseCase: IGetAvailableTeamMembersUseCase,
       
        @inject("IDeleteTeamUseCase") private readonly _deleteTeamUseCase: IDeleteTeamUseCase,

        @inject("IGetMyTeamUseCase") private readonly _getMyTeamUseCase: IGetMyTeamUseCase,
    ) { }

    // Create Team
    createTeam = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: CreateTeamDTO = req.body;

            const team =
                await this._createTeamUseCase.execute(dto);

            res.status(201).json({
                message:
                    MESSAGES.TEAM.TEAM_CREATED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_CREATION_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
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

            const teams =
                await this._getTeamsUseCase.execute(
                    userId,
                    role
                );

            res.status(200).json({
                message:
                    MESSAGES.TEAM.TEAMS_FETCHED_SUCCESSFULLY,
                data: teams,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAMS_FETCH_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    message,
                });
        }
    };

    // Get Team By ID
    getTeamById = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { teamId } = req.params;

            const userId = req.user!.userId;
            const role = req.user!.role;

            const team =
                await this._getTeamByIdUseCase.execute(
                    teamId as string,
                    userId,
                    role
                );

            res.status(200).json({
                message:
                    MESSAGES.TEAM.TEAM_FETCHED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_FETCH_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    message,
                });
        }
    };

    // Update Team
    updateTeam = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { teamId } = req.params;

            const dto: UpdateTeamDTO = req.body;

            const team =
                await this._updateTeamUseCase.execute(
                    teamId as string,
                    dto
                );

            res.status(200).json({
                message:
                    MESSAGES.TEAM.TEAM_UPDATED_SUCCESSFULLY,
                data: team,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_UPDATION_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    message,
                });
        }
    };

    // Add Team Member
    addTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId } = req.params;

    const dto: AddTeamMemberDTO = req.body;

    console.log("========== ADD TEAM MEMBER ==========");
    console.log("Team ID:", teamId);
    console.log("Request body:", dto);

    await this._addTeamMemberUseCase.execute(
      teamId as string,
      dto
    );

    console.log("Team member added successfully");

    res.status(201).json({
      message:
        MESSAGES.TEAM.TEAM_MEMBER_ADDED_SUCCESSFULLY,
    });

  } catch (error) {
    console.error("========== ADD TEAM MEMBER ERROR ==========");
    console.error(error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : TEAM_ERRORS.TEAM_MEMBER_ADD_FAILED,
    });
  }
};

    // Remove Team Member
    removeTeamMember = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { teamId, userId } = req.params;

            await this._removeTeamMemberUseCase.execute(
                teamId as string,
                userId as string
            );

            res.status(200).json({
                message:
                    MESSAGES.TEAM.TEAM_MEMBER_REMOVED_SUCCESSFULLY,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_MEMBER_REMOVE_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    message,
                });
        }
    };

    // Change Team Lead
    changeTeamLead = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { teamId } = req.params;

            const dto: ChangeTeamLeadDTO = req.body;

            await this._changeTeamLeadUseCase.execute(
                teamId as string,
                dto
            );

            res.status(200).json({
                message:
                    MESSAGES.TEAM.TEAM_LEAD_CHANGED_SUCCESSFULLY,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : TEAM_ERRORS.TEAM_LEAD_CHANGE_FAILED;

            res
                .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                    message,
                });
        }
    };


    getTeamMembers = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const teamId = req.params.teamId as string;

            const members =
                await this._getTeamMembersUseCase.execute(
                    teamId
                );

            res.status(200).json({
                message: MESSAGES.TEAM.TEAM_MEMBERS_FETCHED,
                data: members,
            });
        } catch (error) {
            next(error);
        }
    };


    getAvailableTeamMembers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("ENTERED getAvailableTeamMembers controller");

    const users =
      await this._getAvailableTeamMembersUseCase.execute();

    console.log("AVAILABLE USERS:", users);

    res.status(200).json({
      message: "Available team members fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("AVAILABLE TEAM MEMBERS ERROR:", error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch available team members",
    });
  }
};

deleteTeam = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { teamId } = req.params;

        await this._deleteTeamUseCase.execute(teamId as string);

        res.status(HTTP_STATUS.OK).json({
            message: "Team deleted successfully",
        });
    } catch (error) {
    console.error("DELETE TEAM ERROR:", error);

    const message =
        error instanceof Error
            ? error.message
            : "Failed to delete team";

    const status =
        message === TEAM_ERRORS.TEAM_NOT_FOUND
            ? HTTP_STATUS.NOT_FOUND
            : HTTP_STATUS.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
}
};

// Get My Team
getMyTeam = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user!.userId;

        const team = await this._getMyTeamUseCase.execute(userId);

        res.status(HTTP_STATUS.OK).json({
            message: "My team fetched successfully",
            data: team,
        });
    } catch (error) {
        next(error);
    }
};
}

