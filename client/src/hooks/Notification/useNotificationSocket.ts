import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getSocket } from "../../services/socket/socketService";

export const useNotificationSocket = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = getSocket();

        if (!socket) {
            return;
        }

        const handleNewNotification = () => {
            console.log("New notification received!");

            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        };

        socket.on(
            "notification:story-ready",
            handleNewNotification
        );

        socket.on(
            "notification:sprint-planning-meeting",
            handleNewNotification
        );

        return () => {
            socket.off(
                "notification:story-ready",
                handleNewNotification
            );

            socket.off(
                "notification:sprint-planning-meeting",
                handleNewNotification
            );
        };
    }, [queryClient]);
};