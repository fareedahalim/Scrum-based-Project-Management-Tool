import { INotificationEntity } from "../../domain/entities/Notification/INotificationEntity";
import { NotificationDocument } from "../database/models/Notification/NotificationModel";

export class NotificationMapper {
    static toEntity(doc: NotificationDocument): INotificationEntity {
        return {
            _id: doc._id.toString(),
            recipientId: doc.recipientId.toString(),
            senderId: doc.senderId?.toString(),
            eventType: doc.eventType,
            message: doc.message,
            resourceId: doc.resourceId,
            resourceType: doc.resourceType,
            isRead: doc.isRead,
            createdAt: doc.createdAt,
        };
    }
}