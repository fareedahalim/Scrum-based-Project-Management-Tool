import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { IGetNotificationsUseCase } from "../../../application/interface/notification/IGetNotificationsUseCase";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import logger from "../../../config/logger";
import { AuthRequest } from "../../middlewares/auth/authMiddleware";
import { IMarkNotificationAsReadUseCase } from "../../../application/interface/notification/IMarkNotificationAsReadUseCase";
import { IMarkAllNotificationsAsReadUseCase } from "../../../application/interface/notification/IMarkAllNotificationsAsReadUseCase";
@injectable()
export class NotificationController {
    constructor(
        @inject("IGetNotificationsUseCase")
        private _getNotificationsUseCase: IGetNotificationsUseCase,

        @inject("IMarkNotificationAsReadUseCase")
        private _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,

        @inject("IMarkAllNotificationsAsReadUseCase")
        private _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase,

    ) { }

    getNotifications = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const recipientId = req.user!.userId;

            const result = await this._getNotificationsUseCase.execute(recipientId);

            logger.info("Notifications fetched successfully", {
                recipientId,
                unreadCount: result.unreadCount
            });

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.NOTIFICATION.NOTIFICATION_CREATED_SUCCESSFULLY,
                data: result,
            })
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch notifications.";

            logger.error("Failed to fetch notifications", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    }

    markNotificationAsRead = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const notificationId = req.params.notificationId as string;
            const recipientId = req.user!.userId;

            const notification = await this._markNotificationAsReadUseCase.execute(notificationId, recipientId);

            logger.info('Notification marked as read', {
                notificationId,
                recipientId
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to mark notification as read.";

            const status =
                message === "Notification not found."
                    ? HTTP_STATUS.NOT_FOUND
                    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

            if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
                logger.error("Failed to mark notification as read", {
                    error: message,
                });
            }

            res.status(status).json({ message });
        }
    }

    markAllNotificationsAsRead = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            const recipientId = req.user!.userId;

            await this._markAllNotificationsAsReadUseCase.execute(recipientId);

            logger.info("All notifications marked as read", {
                recipientId,
            });

            res.status(HTTP_STATUS.OK).json({
                message: "All notifications marked as read successfully.",
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to mark all notifications as read.";

            logger.error("Failed to mark all notifications as read", {
                error: message,
            });

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message,
            });
        }
    };

}