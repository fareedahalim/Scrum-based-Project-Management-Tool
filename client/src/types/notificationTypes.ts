export type NotificationEventType = "STORY_READY";

export type NotificationResourceType = "STORY";

export interface Notification {
    _id: string;
    recipientId: string;
    senderId?: string;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: NotificationResourceType;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
}