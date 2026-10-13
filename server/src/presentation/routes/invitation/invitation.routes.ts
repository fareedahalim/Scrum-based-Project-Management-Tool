import { Router } from "express";
import { authMiddleware, invitationController } from "../../DI/resolver";
import { acceptInvitationSchema, createInvitationSchema } from "../../validation/invitation.validation";
import { validateRequest } from "../../middlewares/validator";
import { InvitationController } from "../../controllers/invitation/InvitationController";
import { ROUTES } from "../../../shared/constant/routes";


const router = Router();


router.post(
  ROUTES.INVITATION.CREATE_INVITATION,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(createInvitationSchema),
  invitationController.createInvitation
);

router.get(
  ROUTES.INVITATION.GET_INVITATIONS,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  invitationController.getInvitations
);

router.post(
  ROUTES.INVITATION.RESEND_INVITATION,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  invitationController.resendInvitation
);

router.patch(
  ROUTES.INVITATION.CANCEL_INVITATION,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  invitationController.cancelInvitation
);

router.post(ROUTES.INVITATION.ACCEPT_INVITATION,validateRequest(acceptInvitationSchema),invitationController.acceptInvitation)


export default router;