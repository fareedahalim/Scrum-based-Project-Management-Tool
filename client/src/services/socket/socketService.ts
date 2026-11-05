
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentToken: string | null = null;

const SOCKET_URL = new URL(
    import.meta.env.VITE_API_BASE_URL
).origin;



export const connectSocket = (accessToken: string): Socket => {
    if (socket && currentToken === accessToken) {
        if (!socket.connected) {
            socket.connect();
        }
        return socket;
    }

    if (socket) {
        socket.disconnect();
    }

    currentToken = accessToken;

    socket = io(SOCKET_URL, {
        autoConnect: false,
        withCredentials: true,
        auth: {
            token: accessToken,
        },
    });

    // Listen for successful connection
    socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
    });


    // Listen for connection errors
    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
    });

    // Listen for disconnection
    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    socket.connect();

    return socket;
};


export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
        currentToken = null;
    }
};

export const getSocket = (): Socket | null => {
    return socket;
};
