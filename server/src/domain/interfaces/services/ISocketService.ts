export interface ISocketService {
    emitToUser(
        userId: string,
        event: string,
        data: unknown
    ): void;
}