import { NotificationEventType } from "../../enums/NotifictionEventType";

export enum NotificationType {
    STORY = "STORY",
    MEETING = "MEETING",
}

export interface INotificationEntity {
    _id?: string;
    recipientId: string;
    senderId?: string;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: NotificationType;
    isRead: boolean;
    createdAt: Date;
}