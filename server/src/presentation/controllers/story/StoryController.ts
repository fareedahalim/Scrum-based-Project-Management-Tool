
import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";

import { StoryFilter } from "../../../domain/interfaces/repositories/Story/StoryFilter";
import { StoryStatus } from "../../../domain/enums/StoryStatus";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { STORY_ERRORS } from "../../../domain/constants/errorMessages";

import { AuthRequest } from "../../middlewares/auth/authMiddleware";

import { ICreateStoryUseCase } from "../../../application/interface/story/ICreateStoryUseCase";
import { IUpdateStoryUseCase } from "../../../application/interface/story/IUpdateStoryUseCase";
import { IArchiveStoryUseCase } from "../../../application/interface/story/IArchiveStoryUseCase";
import { IGetStoriesByProjectUseCase } from "../../../application/interface/story/IGetStoriesByProjectUseCase";
import { IGetStoriesByEpicUseCase } from "../../../application/interface/story/IGetStoriesByEpicUseCase";

import { CreateStoryDTO } from "../../../application/dtos/story/requestDTOs/CreateStoryDTO";
import { UpdateStoryDTO } from "../../../application/dtos/story/requestDTOs/UpdateStoryDTO";

import logger from "../../../config/logger";

@injectable()
export class StoryController {
    constructor(
        @inject("ICreateStoryUseCase")
        private createStoryUseCase: ICreateStoryUseCase,

        @inject("IUpdateStoryUseCase")
        private updateStoryUseCase: IUpdateStoryUseCase,

        @inject("IArchiveStoryUseCase")
        private archiveStoryUseCase: IArchiveStoryUseCase,

        @inject("IGetStoriesByProjectUseCase")
        private getStoriesByProjectUseCase: IGetStoriesByProjectUseCase,

        @inject("IGetStoriesByEpicUseCase")
        private getStoriesByEpicUseCase: IGetStoriesByEpicUseCase
    ) {}

    createStory = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;

        try {
            const dto: CreateStoryDTO = {
                ...req.body,
                projectId,
            };

            const createdBy = req.user!.userId;

            const story = await this.createStoryUseCase.execute(
                dto,
                createdBy
            );

            logger.info("Story created successfully", {
                projectId,
                userId: createdBy,
            });

            res.status(HTTP_STATUS.CREATED).json({
                message: MESSAGES.STORY.STORY_CREATED_SUCCESSFULLY,
                data: story,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : STORY_ERRORS.STORY_CREATION_FAILED;

            const status =
                message === STORY_ERRORS.STORY_PROJECT_NOT_FOUND ||
                message === STORY_ERRORS.STORY_EPIC_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message === STORY_ERRORS.STORY_TITLE_REQUIRED ||
                      message === STORY_ERRORS.STORY_DESCRIPTION_REQUIRED ||
                      message === STORY_ERRORS.STORY_POINTS_INVALID ||
                      message === STORY_ERRORS.STORY_CREATE_UNDER_ARCHIVED_EPIC
                    ? HTTP_STATUS.BAD_REQUEST
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to create story", {
                    projectId,
                    error: message,
                });
            } else {
                logger.warn("Story creation request rejected", {
                    projectId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    updateStory = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;
        const storyId = req.params.storyId as string;

        try {
            const dto: UpdateStoryDTO = req.body;
            const updatedBy = req.user!.userId;

            const story = await this.updateStoryUseCase.execute(
                projectId,
                storyId,
                dto,
                updatedBy
            );

            logger.info("Story updated successfully", {
                projectId,
                storyId,
                userId: updatedBy,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.STORY.STORY_UPDATED_SUCCESSFULLY,
                data: story,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : STORY_ERRORS.STORY_UPDATION_FAILED;

            const status =
                message === STORY_ERRORS.STORY_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message === STORY_ERRORS.STORY_ALREADY_ARCHIVED ||
                      message === STORY_ERRORS.STORY_TITLE_REQUIRED ||
                      message === STORY_ERRORS.STORY_DESCRIPTION_REQUIRED ||
                      message === STORY_ERRORS.STORY_POINTS_INVALID ||
                      message === STORY_ERRORS.STORY_EPIC_PROJECT_MISMATCH ||
                      message === STORY_ERRORS.STORY_ARCHIVED_EPIC_NOT_ALLOWED
                    ? HTTP_STATUS.BAD_REQUEST
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to update story", {
                    projectId,
                    storyId,
                    error: message,
                });
            } else {
                logger.warn("Story update request rejected", {
                    projectId,
                    storyId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    archiveStory = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;
        const storyId = req.params.storyId as string;

        try {
            const archivedBy = req.user!.userId;

            const story = await this.archiveStoryUseCase.execute(
                projectId,
                storyId,
                archivedBy
            );

            logger.info("Story archived successfully", {
                projectId,
                storyId,
                userId: archivedBy,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.STORY.STORY_ARCHIVED_SUCCESSFULLY,
                data: story,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : STORY_ERRORS.STORY_ARCHIVE_FAILED;

            const status =
                message === STORY_ERRORS.STORY_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : message === STORY_ERRORS.STORY_ALREADY_ARCHIVED
                    ? HTTP_STATUS.BAD_REQUEST
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to archive story", {
                    projectId,
                    storyId,
                    error: message,
                });
            } else {
                logger.warn("Story archive request rejected", {
                    projectId,
                    storyId,
                    status,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    getStoriesByProject = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;

        try {
            const filters: StoryFilter = {
                search:
                    typeof req.query.search === "string"
                        ? req.query.search.trim()
                        : undefined,

                status:
                    typeof req.query.status === "string"
                        ? (req.query.status as StoryStatus)
                        : undefined,

                epicId:
                    typeof req.query.epicId === "string"
                        ? req.query.epicId
                        : undefined,

                includeArchived: req.query.includeArchived === "true",

                page:
                    typeof req.query.page === "string"
                        ? Number(req.query.page)
                        : 1,

                limit:
                    typeof req.query.limit === "string"
                        ? Number(req.query.limit)
                        : 10,
            };

            const result =
                await this.getStoriesByProjectUseCase.execute(
                    projectId,
                    filters
                );

            logger.info("Project stories fetched successfully", {
                projectId,
                page: filters.page,
                limit: filters.limit,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.STORY.STORIES_FETCHED_SUCCESSFULLY,
                data: result,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : STORY_ERRORS.STORIES_FETCH_FAILED;

            const status =
                message === STORY_ERRORS.STORY_PROJECT_NOT_FOUND ||
                message === "Project not found."
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to fetch project stories", {
                    projectId,
                    error: message,
                });
            } else {
                logger.warn("Project stories not found", {
                    projectId,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };

    getStoriesByEpic = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const projectId = req.params.projectId as string;
        const epicId = req.params.epicId as string;

        try {
            const includeArchived = req.query.includeArchived === "true";

            const stories =
                await this.getStoriesByEpicUseCase.execute(
                    projectId,
                    epicId,
                    includeArchived
                );

            logger.info("Epic stories fetched successfully", {
                projectId,
                epicId,
                includeArchived,
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.STORY.STORIES_FETCHED_SUCCESSFULLY,
                data: stories,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : STORY_ERRORS.STORIES_FETCH_FAILED;

            const status =
                message === STORY_ERRORS.STORY_EPIC_NOT_FOUND
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to fetch stories by epic", {
                    projectId,
                    epicId,
                    error: message,
                });
            } else {
                logger.warn("Epic not found while fetching stories", {
                    projectId,
                    epicId,
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    };
}
