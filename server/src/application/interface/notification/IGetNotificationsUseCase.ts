 import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";

export interface IGetNotificationsUseCase {
    execute(
        recipientId: string
    ): Promise<{
        notifications: INotificationEntity[];
        unreadCount: number;
    }>;
}