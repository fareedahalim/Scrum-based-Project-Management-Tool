
import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";

import { ICreateInvitationUseCase } from "../../../application/interface/invitation/ICreateInvitationUseCase";
import { IAcceptInvitationUseCase } from "../../../application/interface/invitation/IAcceptInvitation";
import { IGetInvitationsUseCase } from "../../../application/interface/invitation/IGetInvitations";
import { IResendInvitationUseCase } from "../../../application/interface/invitation/IResendInvitationUseCase";
import { ICancelInvitationUseCase } from "../../../application/interface/invitation/ICancelInvitationUseCase";

import { CreateInvitationDTO } from "../../../application/dtos/invitation/requestDTOs/CreateInvitationDTO";
import { AcceptInvitationDTO } from "../../../application/dtos/invitation/requestDTOs/AcceptInvitationDTO";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import {
    INVITATION_ERRORS,
    USER_ERRORS,
} from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";

import logger from "../../../config/logger";

@injectable()
export class InvitationController {
    constructor(
        @inject("ICreateInvitationUseCase")
        private readonly _createInvitationUseCase: ICreateInvitationUseCase,

        @inject("IAcceptInvitationUseCase")
        private readonly _acceptInvitationUseCase: IAcceptInvitationUseCase,

        @inject("IGetInvitationsUseCase")
        private readonly _getInvitationsUseCase: IGetInvitationsUseCase,

        @inject("IResendInvitationUseCase")
        private readonly _resendInvitationUseCase: IResendInvitationUseCase,

        @inject("ICancelInvitationUseCase")
        private readonly _cancelInvitationUseCase: ICancelInvitationUseCase
    ) {}

    createInvitation = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const dto: CreateInvitationDTO = {
            email: req.body.email,
        };

        const adminId = req.user?.userId;

        if (!adminId) {
            logger.warn("Invitation creation attempted without authentication");

            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: USER_ERRORS.UNAUTHORIZED,
            });
            return;
        }

        try {
            const result = await this._createInvitationUseCase.execute(
                dto,
                adminId
            );

            logger.info("Invitation created successfully", {
                adminId,
            });

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.INVITATION.INVITATION_CREATED_SUCCESSFULLY,
                data: result,
            });
        } catch (error: unknown) {
            logger.error("Failed to create invitation", {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            throw error;
        }
    };

    acceptInvitation = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const dto: AcceptInvitationDTO = {
            token: req.body.token,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        };

        try {
            await this._acceptInvitationUseCase.execute(dto);

            logger.info("Invitation accepted successfully");

            res.status(HTTP_STATUS.OK).json({
                message:
                    INVITATION_ERRORS.INVITATION_ACCEPTED_SUCCESSFULLY,
            });
        } catch (error: unknown) {
            logger.warn("Invitation acceptance failed", {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            throw error;
        }
    };

    getInvitations = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const rawStatus =
            typeof req.query.status === "string"
                ? req.query.status
                : "";

        const validStatuses = [
            "PENDING",
            "ACCEPTED",
            "EXPIRED",
            "CANCELLED",
        ] as const;

        if (
            rawStatus &&
            !validStatuses.includes(
                rawStatus as (typeof validStatuses)[number]
            )
        ) {
            logger.warn("Invalid invitation status filter supplied");

            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid invitation status",
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
            logger.warn("Invalid invitation pagination parameters", {
                page,
                limit,
            });

            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid page or limit",
            });
            return;
        }

        try {
            const result = await this._getInvitationsUseCase.execute({
                search,
                status: rawStatus
                    ? (rawStatus as (typeof validStatuses)[number])
                    : undefined,
                page,
                limit,
            });

            logger.info("Invitations fetched successfully", {
                page,
                limit,
                count: result.invitations.length,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "Invitations fetched successfully",
                data: result.invitations,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        } catch (error: unknown) {
            logger.error("Failed to fetch invitations", {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            throw error;
        }
    };

    resendInvitation = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const invitationId = req.params.id as string;

        try {
            await this._resendInvitationUseCase.execute(invitationId);

            logger.info("Invitation resent successfully", {
                invitationId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "Invitation resent successfully",
            });
        } catch (error: unknown) {
            logger.error("Failed to resend invitation", {
                invitationId,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            throw error;
        }
    };

    cancelInvitation = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const invitationId = req.params.id as string;

        try {
            await this._cancelInvitationUseCase.execute(invitationId);

            logger.info("Invitation cancelled successfully", {
                invitationId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "Invitation cancelled successfully",
            });
        } catch (error: unknown) {
            logger.error("Failed to cancel invitation", {
                invitationId,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            });

            throw error;
        }
    };
}
