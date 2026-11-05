import { inject, injectable } from "tsyringe";

import { IGetNotificationsUseCase } from "../../interface/notification/IGetNotificationsUseCase";

import { INotificationRepository } from "../../../domain/interfaces/repositories/Notification/INotificationRepository";

@injectable()
export class GetNotificationsUseCase
    implements IGetNotificationsUseCase {

    constructor(
        @inject("INotificationRepository")
        private _notificationRepository: INotificationRepository,
    ) {}

    async execute(recipientId: string) {
        const [notifications, unreadCount] = await Promise.all([
            this._notificationRepository.getNotificationsByRecipient(
                recipientId
            ),
            this._notificationRepository.getUnreadCount(recipientId),
        ]);

        return {
            notifications,
            unreadCount,
        };
    }
}