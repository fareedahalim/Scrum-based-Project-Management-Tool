
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../services/Notification/notificationService";

import type { NotificationResponse } from "../../types/notificationTypes";

export const useGetNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            markNotificationAsRead(notificationId),

        onMutate: async (notificationId: string) => {
            await queryClient.cancelQueries({
                queryKey: ["notifications"],
            });

            const previousNotifications =
                queryClient.getQueryData<NotificationResponse>([
                    "notifications",
                ]);

            queryClient.setQueryData<NotificationResponse>(
                ["notifications"],
                (oldData) => {
                    if (!oldData) return oldData;

                    const notification = oldData.notifications.find(
                        (item) => item._id === notificationId,
                    );

                    if (!notification || notification.isRead) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        notifications: oldData.notifications.map((item) =>
                            item._id === notificationId
                                ? { ...item, isRead: true }
                                : item,
                        ),
                        unreadCount: Math.max(0, oldData.unreadCount - 1),
                    };
                },
            );

            return { previousNotifications };
        },

        onError: (_error, _notificationId, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(
                    ["notifications"],
                    context.previousNotifications,
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsAsRead,

        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ["notifications"],
            });

            const previousNotifications =
                queryClient.getQueryData<NotificationResponse>([
                    "notifications",
                ]);

            queryClient.setQueryData<NotificationResponse>(
                ["notifications"],
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        notifications: oldData.notifications.map(
                            (notification) => ({
                                ...notification,
                                isRead: true,
                            }),
                        ),
                        unreadCount: 0,
                    };
                },
            );

            return { previousNotifications };
        },

        onError: (_error, _variables, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(
                    ["notifications"],
                    context.previousNotifications,
                );
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
};
