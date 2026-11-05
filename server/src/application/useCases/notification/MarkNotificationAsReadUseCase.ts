import { inject, injectable } from "tsyringe";

import { IMarkNotificationAsReadUseCase } from "../../interface/notification/IMarkNotificationAsReadUseCase";

import { INotificationRepository } from "../../../domain/interfaces/repositories/Notification/INotificationRepository";
import { NOTIFICATION_ERRORS } from "../../../domain/constants/errorMessages";

@injectable()
export class MarkNotificationAsReadUseCase
    implements IMarkNotificationAsReadUseCase {

    constructor(
        @inject("INotificationRepository")
        private _notificationRepository: INotificationRepository,
    ) {}

    async execute(
        notificationId: string,
        recipientId: string
    ) {
        const notification = await this._notificationRepository.markAsRead(
            notificationId,
            recipientId
        );

        if (!notification) {
            throw new Error(NOTIFICATION_ERRORS.NOTIFICATION_NOT_FOUND);
        }

        return notification;
    }
}