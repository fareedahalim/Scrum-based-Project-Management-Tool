import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { container } from "tsyringe";

import { IJwtService } from "../../domain/interfaces/services/IJwtService";
import { IUserRepository } from "../../domain/interfaces/repositories/User/IUserRepository";
import { ITokenBlacklistRepository } from "../../domain/interfaces/repositories/JwtBlackList/ITokenBlacklistRepository";
import { SocketService } from "../service/SocketService";


export const initializeSocketServer = (httpServer: HttpServer): Server => {

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL?.split(",") ?? [],
            credentials: true,
        },
    });

    const jwtService = container.resolve<IJwtService>("IJwtService");
    const userRepository = container.resolve<IUserRepository>("IUserRepository");
    const blacklistRepository = container.resolve<ITokenBlacklistRepository>(
        "ITokenBlacklistRepository"
    );
    const socketService = container.resolve<SocketService>("ISocketService");
socketService.initialize(io);

    // Socket authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token || typeof token !== "string") {
                return next(new Error("Authentication token is required"));
            }

            // 1. Check whether the token is blacklisted
            const isBlacklisted = await blacklistRepository.isBlacklisted(token);

            if (isBlacklisted) {
                return next(new Error("Token is invalid or expired"));
            }

            // 2. Verify JWT
            const payload = jwtService.verifyAccessToken(token);

            // 3. Check whether user exists
            const user = await userRepository.findById(payload.userId);

            if (!user) {
                return next(new Error("User not found"));
            }

            // 4. Check whether user is active
            if (!user.isActive) {
                return next(new Error("Your account is inactive"));
            }

            // Store authenticated user information
            socket.data.userId = user._id;
            socket.data.role = user.role;

            next();

        } catch {
            next(new Error("Socket authentication failed"));
        }
    });

    // Handle authenticated connections
    io.on("connection", (socket) => {

        const userId = socket.data.userId;

        // Every user joins their own private room
        socket.join(`user:${userId}`);

        console.log("Socket connected successfully:", userId);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
};