
import mongoose, { Types, Document } from "mongoose";

// import { NotificationType } from "../../../../../domain/entities/Notification/INotificationEntity";
import { NotificationEventType } from "../../../../domain/enums/NotifictionEventType";
import { NotificationType } from "../../../../domain/entities/Notification/INotificationEntity";
// import { NotificationEventType } from "../../../../../domain/enums/NotificationEventType";

export interface NotificationDocument extends Document {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId;
    senderId?: Types.ObjectId;
    eventType: NotificationEventType;
    message: string;
    resourceId?: string;
    resourceType?: NotificationType;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new mongoose.Schema<NotificationDocument>(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        eventType: {
            type: String,
            enum: Object.values(NotificationEventType),
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        resourceId: {
            type: String,
            required: false,
        },

        resourceType: {
            type: String,
            enum: Object.values(NotificationType),
            required: false,
        },

        isRead: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

// Retrieve notifications for a recipient, newest first.
notificationSchema.index({
    recipientId: 1,
    createdAt: -1,
});

// Retrieve unread notifications for a recipient.
notificationSchema.index({
    recipientId: 1,
    isRead: 1,
});

export const NotificationModel = mongoose.model<NotificationDocument>(
    "Notification",
    notificationSchema
);
