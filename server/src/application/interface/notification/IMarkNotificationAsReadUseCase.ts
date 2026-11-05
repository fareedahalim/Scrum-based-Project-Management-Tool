import { INotificationEntity } from "../../../domain/entities/Notification/INotificationEntity";

export interface IMarkNotificationAsReadUseCase {
    execute(
        notificationId: string,
        recipientId: string
    ): Promise<INotificationEntity>;
}