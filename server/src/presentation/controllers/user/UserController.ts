
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import {
    ERROR_MESSAGES,
    USER_ERRORS,
} from "../../../domain/constants/errorMessages";

import { UpdatedUserDTO } from "../../../application/dtos/user/requestDTOs/UpdatedUserDTO";
import { IGetUsersUseCase } from "../../../application/interface/user/IGetUsersUseCase";
import { IGetUserByIdUseCase } from "../../../application/interface/user/IGetUserByIdUseCase";
import { IUpdateUserUseCase } from "../../../application/interface/user/IUpdateUserUseCase";
import { IActivateUserUseCase } from "../../../application/interface/user/IActivateUserUseCase";
import { IDeactivateUserUseCase } from "../../../application/interface/user/IDeactivateUserUseCase";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import { UserRoles } from "../../../domain/enums/UserRole";
import logger from "../../../config/logger";

@injectable()
export class UserController {
    constructor(
        @inject("IGetUsersUseCase")
        private readonly _getUsersUseCase: IGetUsersUseCase,

        @inject("IGetUserByIdUseCase")
        private readonly _getUserByIdUseCase: IGetUserByIdUseCase,

        @inject("IUpdateUserUseCase")
        private readonly _updateUserUseCase: IUpdateUserUseCase,

        @inject("IActivateUserUseCase")
        private readonly _activateUserUseCase: IActivateUserUseCase,

        @inject("IDeactivateUserUseCase")
        private readonly _deactivateUserUseCase: IDeactivateUserUseCase
    ) {}

    // GET USERS WITH SEARCH, FILTERS AND PAGINATION
    getUsers = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const search =
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : "";

            const rawRole =
                typeof req.query.role === "string"
                    ? req.query.role
                    : "";

            const rawStatus =
                typeof req.query.status === "string"
                    ? req.query.status
                    : "";

            const validRoles = Object.values(UserRoles);

            if (
                rawRole &&
                !validRoles.includes(rawRole as UserRoles)
            ) {
                logger.warn("User list request contains an invalid role", {
                    role: rawRole,
                });

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid user role",
                });
                return;
            }

            const validStatuses = ["ACTIVE", "INACTIVE"] as const;

            if (
                rawStatus &&
                !validStatuses.includes(
                    rawStatus as (typeof validStatuses)[number]
                )
            ) {
                logger.warn("User list request contains an invalid status", {
                    status: rawStatus,
                });

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid user status",
                });
                return;
            }

            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);

            if (
                !Number.isInteger(page) ||
                page < 1 ||
                !Number.isInteger(limit) ||
                limit < 1 ||
                limit > 100
            ) {
                logger.warn("User list request contains invalid pagination", {
                    page,
                    limit,
                });

                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid page or limit",
                });
                return;
            }

            const result = await this._getUsersUseCase.execute({
                search,
                role: rawRole
                    ? (rawRole as (typeof validRoles)[number])
                    : undefined,
                status: rawStatus
                    ? (rawStatus as (typeof validStatuses)[number])
                    : undefined,
                page,
                limit,
            });

            logger.info("Users fetched successfully", {
                page,
                limit,
                total: result.total,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.USERS_FETCH_SUCCESSFULLY,
                data: result.users,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USERS_FETCH_FAILED;

            logger.error("Failed to fetch users", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // GET USER BY ID
    getUserById = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const userId = req.params.userId as string;

        try {
            const user = await this._getUserByIdUseCase.execute(userId);

            if (!user) {
                logger.warn("User not found", {
                    userId,
                });

                res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: USER_ERRORS.USER_NOT_FOUND,
                    data: null,
                });
                return;
            }

            logger.info("User fetched successfully", {
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.USER_FETCHED_SUCCESSFULLY,
                data: user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USER_FETCH_FAILED;

            logger.error("Failed to fetch user", {
                userId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // UPDATE USER
    updateUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const userId = req.params.userId as string;

        try {
            const dto: UpdatedUserDTO = {
                userId,
                ...req.body,
            };

            const user = await this._updateUserUseCase.execute(dto);

            logger.info("User updated successfully", {
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.USER_UPDATED_SUCCESSFULLY,
                data: user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USER_UPDATION_FAILED;

            logger.error("Failed to update user", {
                userId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // ACTIVATE USER
    activateUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const userId = req.params.userId as string;

        try {
            const user = await this._activateUserUseCase.execute(userId);

            logger.info("User activated successfully", {
                userId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.USER_ACTIVATED_SUCCESSFULLY,
                data: user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USER_ACTIVATION_FAILED;

            logger.error("Failed to activate user", {
                userId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

    // DEACTIVATE USER
    deactivateUser = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const userId = req.params.userId as string;

        try {
            if (!req.user) {
                logger.warn("Unauthorized user deactivation attempt", {
                    targetUserId: userId,
                });

                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    message: ERROR_MESSAGES.UNAUTHORIZED,
                });
                return;
            }

            const currentUserId = req.user.userId;

            const user = await this._deactivateUserUseCase.execute(
                userId,
                currentUserId
            );

            logger.info("User deactivated successfully", {
                targetUserId: userId,
                performedBy: currentUserId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.USER_DEACTIVATED_SUCCESSFULLY,
                data: user,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USER_DEACTIVATION_FAILED;

            logger.error("Failed to deactivate user", {
                targetUserId: userId,
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };
}
