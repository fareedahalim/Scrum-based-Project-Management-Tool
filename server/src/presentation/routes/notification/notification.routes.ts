import { Router } from "express";
import { ROUTES } from "../../../shared/constant/routes";
import { authMiddleware, notificationController } from "../../DI/resolver";

const router = Router();

router.get(ROUTES.NOTIFICATION.GET_NOTIFICATIONS,
    authMiddleware.authenticate,
    notificationController.getNotifications
);

router.patch(
    ROUTES.NOTIFICATION.MARK_AS_READ,
    authMiddleware.authenticate,
    notificationController.markNotificationAsRead
);

router.patch(
    ROUTES.NOTIFICATION.MARK_ALL_AS_READ,
    authMiddleware.authenticate,
    notificationController.markAllNotificationsAsRead
);
export default router;