export interface IMarkAllNotificationsAsReadUseCase {
    execute(recipientId: string): Promise<void>;
}