import Router from "express";

import { ROUTES } from "../../../shared/constant/routes";

import {
  authMiddleware,
  userController,
} from "../../DI/resolver";

import { validateRequest } from "../../middlewares/validator";

import { updateUserSchema } from "../../validation/user.validation";

const router = Router();


// Get all users
router.get(
  ROUTES.USER.GET_ALL,
  authMiddleware.authenticate,
  userController.getUsers
);


// Get user by ID
router.get(
  ROUTES.USER.GET_BY_ID,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  userController.getUserById
);


// Update user
router.patch(
  ROUTES.USER.UPDATE,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  validateRequest(updateUserSchema),
  userController.updateUser
);


// Activate user
router.patch(
  ROUTES.USER.ACTIVATE,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  userController.activateUser
);


// Deactivate user
router.patch(
  ROUTES.USER.DEACTIVATE,
  authMiddleware.authenticate,
  authMiddleware.authorizeAdmin,
  userController.deactivateUser
);


export default router;