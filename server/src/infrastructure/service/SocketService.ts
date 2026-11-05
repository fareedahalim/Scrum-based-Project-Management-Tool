import { injectable } from "tsyringe";
import { Server } from "socket.io";

import { ISocketService } from "../../domain/interfaces/services/ISocketService";

@injectable()
export class SocketService implements ISocketService {
    private _io: Server | null = null;

    initialize(io: Server): void {
        this._io = io;
    }

    emitToUser(
        userId: string,
        event: string,
        data: unknown
    ): void {
        if (!this._io) {
            console.error("Socket.IO server is not initialized.");
            return;
        }

        console.log("Sending notification to:", userId);
console.log("Notification data:", data);

        this._io.to(`user:${userId}`).emit(event, data);
    }
}