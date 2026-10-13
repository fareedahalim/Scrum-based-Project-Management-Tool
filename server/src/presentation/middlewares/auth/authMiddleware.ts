import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";

import { IJwtService } from "../../../domain/interfaces/services/IJwtService";
// import { ITo/kenBlacklistRepository } from "../../../domain/interfaces/repositories/ITokenBlacklistRepository";
// import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";

// import { JwtPayload } from "../../../domain/entities/IJwtPayload";

import {
  ERROR_MESSAGES,
  USER_ERRORS,
} from "../../../domain/constants/errorMessages";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { JwtPayload } from "../../../domain/entities/Jwt/IJwtPayload";
import { ITokenBlacklistRepository } from "../../../domain/interfaces/repositories/JwtBlackList/ITokenBlacklistRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/User/IUserRepository";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJwtService")
    private readonly _jwtService: IJwtService,

    @inject("ITokenBlacklistRepository")
    private readonly _blacklistRepo: ITokenBlacklistRepository,

    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Get Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      // 2. Extract token
      const token = authHeader.split(" ")[1];

      if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
        return;
      }

      // 3. Check whether token is blacklisted
      const isBlacklisted = await this._blacklistRepo.isBlacklisted(token);

      if (isBlacklisted) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.TOKEN_REVOKED,
        });
        return;
      }

      // 4. Verify JWT
      const payload = this._jwtService.verifyAccessToken(token);

      if (!payload) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.INVALID_TOKEN,
        });
        return;
      }

      // 5. Find user from database
      const user = await this._userRepository.findById(payload.userId);

      if (!user) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: USER_ERRORS.USER_NOT_FOUND,
        });
        return;
      }

      // 6. Check whether user is active
      if (!user.isActive) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          message: USER_ERRORS.USER_NOT_ACTIVE,
        });
        return;
      }

      // 7. Attach authenticated user information to request
      req.user = payload;

      // 8. Continue to controller
      next();
    } catch (error) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }
  };


  authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    if (req.user.role !== "ADMIN") {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.FORBIDDEN,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      message: ERROR_MESSAGES.FORBIDDEN,
    });
  }
};
}