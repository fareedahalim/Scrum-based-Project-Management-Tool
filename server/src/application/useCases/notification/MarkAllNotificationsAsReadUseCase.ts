import { inject, injectable } from "tsyringe";

import { IMarkAllNotificationsAsReadUseCase } from "../../interface/notification/IMarkAllNotificationsAsReadUseCase";
import { INotificationRepository } from "../../../domain/interfaces/repositories/Notification/INotificationRepository";

@injectable()
export class MarkAllNotificationsAsReadUseCase
    implements IMarkAllNotificationsAsReadUseCase {

    constructor(
        @inject("INotificationRepository")
        private _notificationRepository: INotificationRepository,
    ) {}

    async execute(recipientId: string): Promise<void> {
        await this._notificationRepository.markAllAsRead(recipientId);
    }
}