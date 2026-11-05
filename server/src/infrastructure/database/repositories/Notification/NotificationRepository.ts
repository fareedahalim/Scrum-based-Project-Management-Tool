import { INotificationEntity } from "../../../../domain/entities/Notification/INotificationEntity";
import { INotificationRepository } from "../../../../domain/interfaces/repositories/Notification/INotificationRepository";
import { NotificationMapper } from "../../../mappers/NotificationMapper";
import { NotificationModel } from "../../models/Notification/NotificationModel";

export class NotificationRepository implements INotificationRepository {
    async createNotification(notification: INotificationEntity): Promise<INotificationEntity> {
        const doc = await NotificationModel.create({
            recipientId: notification.recipientId,
            senderId: notification.senderId,
            eventType: notification.eventType,
            message: notification.message,
            resourceId: notification.resourceId,
            resourceType: notification.resourceType,
            isRead: false
        })
        return NotificationMapper.toEntity(doc)

    }

    async getNotificationsByRecipient(recipientId: string): Promise<INotificationEntity[]> {

        const docs = await NotificationModel.find({
            recipientId: recipientId,
        })
            .sort({ createdAt: -1 })
            .exec();

        return docs.map((doc) => NotificationMapper.toEntity(doc));
    }

    async markAsRead(notificationId: string, recipientId: string): Promise<INotificationEntity | null> {
        const doc = await NotificationModel.findOneAndUpdate(
            {
                _id: notificationId,
                recipientId
            },
            {
                $set: {
                    isRead: true,
                },
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        )

        return doc ? NotificationMapper.toEntity(doc) : null;
    }

    async getUnreadCount(recipientId: string): Promise<number> {

        return NotificationModel.countDocuments({
            recipientId,
            isRead: false,
        }).exec();
    }

    async markAllAsRead(recipientId: string): Promise<void> {
    await NotificationModel.updateMany(
        {
            recipientId,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
            },
        },
        {
            runValidators: true,
        }
    ).exec();
}

} 