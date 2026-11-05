import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import type { Notification, NotificationResponse } from "../../types/notificationTypes";


export const getNotifications = async (): Promise<NotificationResponse> => {
    const response = await AxiosInstance.get(
        API_ROUTES.NOTIFICATION.GET_NOTIFICATIONS,
    );

    return response.data.data;
};

export const markNotificationAsRead = async (
    notificationId: string,
): Promise<Notification> => {
    const response = await AxiosInstance.patch(
        API_ROUTES.NOTIFICATION.MARK_AS_READ(notificationId),
    );

    return response.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    await AxiosInstance.patch(
        API_ROUTES.NOTIFICATION.MARK_ALL_AS_READ,
    );
};

