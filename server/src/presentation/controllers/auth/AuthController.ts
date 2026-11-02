
import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";

import { IRegisterUserCase } from "../../../application/interface/auth/IRegisterUserUseCase";
import { RegisterUserDTO } from "../../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { IVerifyEmailUseCase } from "../../../application/interface/auth/IVerifyEmailUseCase";
import { VerifyEmailDTO } from "../../../application/dtos/auth/requestDTOs/VerifyEmailDTO";
import { IResendOtpUseCase } from "../../../application/interface/auth/IResendOtpUseCase";
import { ILoginUserUseCase } from "../../../application/interface/auth/ILoginUserUseCase";
import { LoginUserDTO } from "../../../application/dtos/auth/requestDTOs/LoginUserDTO";
import { IRefreshTokenUseCase } from "../../../application/interface/auth/IRefreshTokenUseCase";
import { RefreshTokenDTO } from "../../../application/dtos/auth/requestDTOs/RefreshTokenDTO";
import { ILogoutUserUseCase } from "../../../application/interface/auth/ILogoutUserUseCase";
import { IForgotPasswordUserUseCase } from "../../../application/interface/auth/IForgotPassword";
import { ForgotPasswordDTO } from "../../../application/dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IResetPasswordUseCase } from "../../../application/interface/auth/IResetPasswordUseCase";
import { IVerifyResetOtpUseCase } from "../../../application/interface/auth/IVerifyResetOtpUseCase";
import { IGoogleLoginUseCase } from "../../../application/interface/auth/IGoogleLoginUseCase";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";

import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { env } from "../../../config/env";
import logger from "../../../config/logger";

@injectable()
export class AuthController {
    constructor(
        @inject("IRegisterUserUseCase")
        private readonly _registerUserUseCase: IRegisterUserCase,

        @inject("IVerifyEmailUseCase")
        private readonly _verifyEmailUseCase: IVerifyEmailUseCase,

        @inject("IResendOtpUseCase")
        private readonly _resendOtpUseCase: IResendOtpUseCase,

        @inject("ILoginUseCase")
        private readonly _loginUseCase: ILoginUserUseCase,

        @inject("IRefreshTokenUseCase")
        private readonly _refreshToken: IRefreshTokenUseCase,

        @inject("ILogoutUserUseCase")
        private readonly _logoutUseCase: ILogoutUserUseCase,

        @inject("IForgotPasswordUserUseCase")
        private readonly _forgotPasswordUserUseCase: IForgotPasswordUserUseCase,

        @inject("IResetPasswordUseCase")
        private readonly _resetPasswordUseCase: IResetPasswordUseCase,

        @inject("IVerifyResetOtpUseCase")
        private readonly _verifyResetOtpUseCase: IVerifyResetOtpUseCase,

        @inject("IGoogleLoginUseCase")
        private readonly _googleLoginUseCase: IGoogleLoginUseCase,

        @inject("IGoogleAuthService")
        private readonly _googleAuthService: IGoogleAuthService
    ) {}

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const dto: RegisterUserDTO = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
            };

            await this._registerUserUseCase.execute(dto);

            logger.info("User registration OTP sent");

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.OTP.OTP_SENT,
            });
        } catch (error: unknown) {
            logger.error("User registration failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            });
            next(error);
        }
    };

    verifyEmail = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const dto: VerifyEmailDTO = {
            email: req.body.email,
            otp: req.body.otp,
        };

        await this._verifyEmailUseCase.execute(dto);

        logger.info("Email verification successful");

        res.status(HTTP_STATUS.OK).json({
            message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL,
        });
    };

    resendOtp = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const { email } = req.body;

        await this._resendOtpUseCase.execute(email);

        logger.info("Email verification OTP resent");

        res.json({
            message: MESSAGES.OTP.RESEND_OTP_SUCCESSFULL,
        });
    };

    login = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: LoginUserDTO = {
                email: req.body.email,
                password: req.body.password,
            };

            const response = await this._loginUseCase.execute(dto);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: env.REFRESH_TOKEN_MAX_AGE,
            });

            logger.info("Login successful");

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.LOGIN_SUCCESS,
                data: response,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.INVALID_CREDENTIALS;

            logger.warn("Login failed", {
                error: message,
            });

            res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
                message,
            });
        }
    };

    refreshToken = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING,
            });
            return;
        }

        try {
            const dto: RefreshTokenDTO = {
                refreshToken,
            };

            const response = await this._refreshToken.execute(dto);

            logger.info("Refresh token renewed");

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL,
                data: response,
            });
        } catch (error: unknown) {
            logger.warn("Refresh token renewal failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            });

            res.clearCookie("refreshToken");

            const message =
                error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED;

            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message,
            });
        }
    };

    forgotPassword = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const dto: ForgotPasswordDTO = {
                email: req.body.email,
            };

            await this._forgotPasswordUserUseCase.execute(dto);

            logger.info("Password reset request processed");

            res.status(HTTP_STATUS.OK).json({
                message: MESSAGES.USERS.PASSWORD_UPDATED_SUCCESSFULLY,
            });
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : USER_ERRORS.USER_NOT_FOUND;

            logger.warn("Password reset request failed", {
                error: message,
            });

            res.status(HTTP_STATUS.NOT_FOUND).json({
                message,
            });
        }
    };

    verifyResetOtp = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        await this._verifyResetOtpUseCase.execute(req.body);

        logger.info("Password reset OTP verified");

        res.json({
            message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL,
        });
    };

    resetPassword = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        await this._resetPasswordUseCase.execute(req.body);

        logger.info("Password reset successful");

        res.json({
            message: MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY,
        });
    };

    logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (token) {
                await this._logoutUseCase.execute(token);
            }

            res.clearCookie("refreshToken");

            logger.info("User logged out");

            res.json({
                message: MESSAGES.USERS.LOGOUT_SECCESS,
            });
        } catch (error: unknown) {
            logger.error("Logout failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            });

            next(error);
        }
    };

    googleRedirect = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        try {
            const url = this._googleAuthService.getAuthorizationUrl();

            res.redirect(url);
        } catch (error: unknown) {
            logger.error("Google OAuth redirect failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            });

            next(error);
        }
    };

    googleCallback = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const code = req.query.code as string;

            if (!code) {
                logger.warn("Google OAuth callback received without a code");

                res.status(400).json({
                    message: "Google authorization code is missing",
                });
                return;
            }

            const response = await this._googleLoginUseCase.execute({
                code,
            });

            const { refreshToken } = response;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: env.NODE_ENV === "production",
                maxAge: env.REFRESH_TOKEN_MAX_AGE,
            });

            logger.info("Google login successful");

            res.redirect(`${env.CLIENT_URL}/auth/google/callback`);
        } catch (error: unknown) {
            logger.error("Google login failed", {
                error: error instanceof Error ? error.message : "Unknown error",
            });

            next(error);
        }
    };
}
