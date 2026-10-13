import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";



import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";

import { UpdatedUserDTO } from "../../../application/dtos/user/requestDTOs/UpdatedUserDTO";
import { IGetUsersUseCase } from "../../../application/interface/user/IGetUsersUseCase";
import { IGetUserByIdUseCase } from "../../../application/interface/user/IGetUserByIdUseCase";
import { IUpdateUserUseCase } from "../../../application/interface/user/IUpdateUserUseCase";
import { IActivateUserUseCase } from "../../../application/interface/user/IActivateUserUseCase";
import { IDeactivateUserUseCase } from "../../../application/interface/user/IDeactivateUserUseCase";
import { AuthRequest } from "../../middlewares/auth/authMiddleware";

@injectable()
export class UserController {
  constructor(
    @inject("IGetUsersUseCase")
    private readonly _getUsersUseCase: IGetUsersUseCase,

    @inject("IGetUserByIdUseCase")
    private readonly _getUserByIdUseCase: IGetUserByIdUseCase,

    @inject("IUpdateUserUseCase")
    private readonly _updateUserUseCase: IUpdateUserUseCase,

    @inject("IActivateUserUseCase")
    private readonly _activateUserUseCase: IActivateUserUseCase,

    @inject("IDeactivateUserUseCase")
    private readonly _deactivateUserUseCase: IDeactivateUserUseCase
  ) {}

  // =========================
  // GET ALL USERS
  // =========================
  getUsers = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const users = await this._getUsersUseCase.execute();

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.USERS.USERS_FETCH_SUCCESSFULLY,
        data: users,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : USER_ERRORS.USERS_FETCH_FAILED;

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message,
      });
    }
  };

  // =========================
  // GET USER BY ID
  // =========================
  getUserById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this._getUserByIdUseCase.execute(
        userId as string
      );

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          message: USER_ERRORS.USER_NOT_FOUND,
          data: null,
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.USERS.USER_FETCHED_SUCCESSFULLY,
        data: user,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : USER_ERRORS.USER_FETCH_FAILED;

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message,
      });
    }
  };

  // =========================
  // UPDATE USER
  // =========================
  updateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      const dto: UpdatedUserDTO = {
        userId,
        ...req.body,
      };

      const user = await this._updateUserUseCase.execute(dto);

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.USERS.USER_UPDATED_SUCCESSFULLY,
        data: user,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : USER_ERRORS.USER_UPDATION_FAILED;

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message,
      });
    }
  };

  // =========================
  // ACTIVATE USER
  // =========================
  activateUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      const user = await this._activateUserUseCase.execute(
        userId as string
      );

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.USERS.USER_ACTIVATED_SUCCESSFULLY,
        data: user,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : USER_ERRORS.USER_ACTIVATION_FAILED;

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message,
      });
    }
  };

  // =========================
  // DEACTIVATE USER
  // =========================
  deactivateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const currentUserId = req.user.userId;

    const user = await this._deactivateUserUseCase.execute(
      userId as string,
      currentUserId
    );

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.USERS.USER_DEACTIVATED_SUCCESSFULLY,
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : USER_ERRORS.USER_DEACTIVATION_FAILED;

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message,
    });
  }
};
}