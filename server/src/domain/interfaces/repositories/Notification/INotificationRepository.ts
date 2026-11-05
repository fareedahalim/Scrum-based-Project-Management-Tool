import { INotificationEntity } from "../../../entities/Notification/INotificationEntity";

export interface INotificationRepository {
    createNotification(
        notification: INotificationEntity
    ): Promise<INotificationEntity>;

    getNotificationsByRecipient(
        recipientId: string
    ): Promise<INotificationEntity[]>;

    markAsRead(
        notificationId: string,
        recipientId: string
    ): Promise<INotificationEntity | null>;

    getUnreadCount(
        recipientId: string
    ): Promise<number>;

    markAllAsRead(
    recipientId: string
): Promise<void>;
}