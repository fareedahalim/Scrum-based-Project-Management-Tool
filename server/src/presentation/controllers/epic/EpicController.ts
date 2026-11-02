
import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { EPIC_ERRORS } from "../../../domain/constants/errorMessages";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";

import { ICreateEpicUseCase } from "../../../application/interface/epic/ICreateEpicUseCase";
import { IUpdateEpicUseCase } from "../../../application/interface/epic/IUpdateEpicUseCase";
import { IArchiveEpicUseCase } from "../../../application/interface/epic/IArchiveEpicUseCase";
import { IGetEpicsByProjectUseCase } from "../../../application/interface/epic/IGetEpicsByProjectUseCase";

import { CreateEpicDTO } from "../../../application/dtos/epic/requestDTOs/CreateEpicDTO";
import { UpdateEpicDTO } from "../../../application/dtos/epic/requestDTOs/UpdateEpicDTO";

import logger from "../../../config/logger";

@injectable()
export class EpicController {
    constructor(
        @inject("ICreateEpicUseCase")
        private createEpicUseCase: ICreateEpicUseCase,

        @inject("IUpdateEpicUseCase")
        private updateEpicUseCase: IUpdateEpicUseCase,

        @inject("IArchiveEpicUseCase")
        private archiveEpicUseCase: IArchiveEpicUseCase,

        @inject("IGetEpicsByProjectUseCase")
        private getEpicsByProjectUseCase: IGetEpicsByProjectUseCase
    ) {}

    createEpic = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;

        try {
            const dto: CreateEpicDTO = {
                ...req.body,
                projectId,
            };

            const createdBy = req.user!.userId;

            const epic = await this.createEpicUseCase.execute(
                dto,
                createdBy
            );

            logger.info("Epic created successfully", {
                projectId,
            });

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.EPIC.EPIC_CREATED_SUCCESSFULLY,
                data: epic,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : EPIC_ERRORS.EPIC_CREATION_FAILED;

            const status =
                message === EPIC_ERRORS.EPIC_PROJECT_NOT_FOUND ||
                message === EPIC_ERRORS.EPIC_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message.includes("required") ||
                      message.includes("Invalid") ||
                      message.includes("earlier than") ||
                      message.includes("already exists")
                        ? HTTP_STATUS.BAD_REQUEST
                        : message.includes("Only the assigned Product Owner")
                            ? HTTP_STATUS.FORBIDDEN
                            : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to create epic", {
                    projectId,
                    error: message,
                });
            } else {
                logger.warn("Epic creation request failed", {
                    projectId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    updateEpic = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const epicId = req.params.epicId as string;

        try {
            const dto: UpdateEpicDTO = req.body;
            const updatedBy = req.user!.userId;

            const epic = await this.updateEpicUseCase.execute(
                epicId,
                dto,
                updatedBy
            );

            logger.info("Epic updated successfully", {
                epicId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.EPIC.EPIC_UPDATED_SUCCESSFULLY,
                data: epic,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : EPIC_ERRORS.EPIC_UPDATION_FAILED;

            const status =
                message === EPIC_ERRORS.EPIC_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message.includes("Only the assigned Product Owner")
                        ? HTTP_STATUS.FORBIDDEN
                        : message.includes("required") ||
                          message.includes("empty") ||
                          message.includes("Invalid") ||
                          message.includes("earlier than") ||
                          message.includes("At least one field") ||
                          message.includes("already archived") ||
                          message.includes("cannot be updated")
                            ? HTTP_STATUS.BAD_REQUEST
                            : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to update epic", {
                    epicId,
                    error: message,
                });
            } else {
                logger.warn("Epic update request failed", {
                    epicId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    archiveEpic = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const epicId = req.params.epicId as string;

        try {
            const archivedBy = req.user!.userId;

            const epic = await this.archiveEpicUseCase.execute(
                epicId,
                archivedBy
            );

            logger.info("Epic archived successfully", {
                epicId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.EPIC.EPIC_ARCHIVED_SUCCESSFULLY,
                data: epic,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : EPIC_ERRORS.EPIC_ARCHIVE_FAILED;

            const status =
                message === EPIC_ERRORS.EPIC_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message.includes("Only the assigned Product Owner")
                        ? HTTP_STATUS.FORBIDDEN
                        : message.includes("already archived") ||
                          message.includes("contains stories")
                            ? HTTP_STATUS.BAD_REQUEST
                            : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to archive epic", {
                    epicId,
                    error: message,
                });
            } else {
                logger.warn("Epic archive request failed", {
                    epicId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    getEpicsByProject = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;

        try {
            const includeArchived =
                req.query.includeArchived === "true";

            const epics = await this.getEpicsByProjectUseCase.execute(
                projectId,
                includeArchived
            );

            logger.info("Project epics fetched successfully", {
                projectId,
                includeArchived,
                count: epics.length,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.EPIC.EPICS_FETCHED_SUCCESSFULLY,
                data: epics,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : EPIC_ERRORS.EPICS_FETCH_FAILED;

            const status =
                message === EPIC_ERRORS.EPIC_PROJECT_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to fetch project epics", {
                    projectId,
                    error: message,
                });
            } else {
                logger.warn("Fetching project epics failed", {
                    projectId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };
}
