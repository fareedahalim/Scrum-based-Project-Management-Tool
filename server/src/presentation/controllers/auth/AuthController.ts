import { inject, injectable } from "tsyringe";
import { IRegisterUserCase } from "../../../application/interface/auth/IRegisterUserUseCase";
import { Request, Response, NextFunction } from "express";
import { RegisterUserDTO } from "../../../application/dtos/auth/requestDTOs/RegisterUserDTO";
import { HTTP_STATUS } from "../../../domain/constants/httpStatus";
import { MESSAGES } from "../../../domain/constants/messages";
import { IVerifyEmailUseCase } from "../../../application/interface/auth/IVerifyEmailUseCase";
import { VerifyEmailDTO } from "../../../application/dtos/auth/requestDTOs/VerifyEmailDTO";
import { IResendOtpUseCase } from "../../../application/interface/auth/IResendOtpUseCase";
import { json } from "zod";
import { ILoginUserUseCase } from "../../../application/interface/auth/ILoginUserUseCase";
import { LoginUserDTO } from "../../../application/dtos/auth/requestDTOs/LoginUserDTO";
import { env } from "../../../config/env";
import logger from "../../../config/logger";
import { ERROR_MESSAGES, USER_ERRORS } from "../../../domain/constants/errorMessages";
import { RefreshTokenDTO } from "../../../application/dtos/auth/requestDTOs/RefreshTokenDTO";
import { IRefreshTokenUseCase } from "../../../application/interface/auth/IRefreshTokenUseCase";
import { ILogoutUserUseCase } from "../../../application/interface/auth/ILogoutUserUseCase";
import { IForgotPasswordUserUseCase } from "../../../application/interface/auth/IForgotPassword";
import { ForgotPasswordDTO } from "../../../application/dtos/auth/requestDTOs/ForgotPasswordDTO";
import { IResetPasswordUseCase } from "../../../application/interface/auth/IResetPasswordUseCase";
import { IVerifyResetOtpUseCase } from "../../../application/interface/auth/IVerifyResetOtpUseCase";
import { IGoogleLoginUseCase } from "../../../application/interface/auth/IGoogleLoginUseCase";
import { GoogleLoginDTO } from "../../../application/dtos/auth/requestDTOs/GoogleLoginDTO";
import { IGoogleAuthService } from "../../../domain/interfaces/services/IGoogleAuthService";

@injectable()
export class AuthController {
    constructor(
        @inject('IRegisterUserUseCase') private readonly _registerUserUseCase: IRegisterUserCase,
        @inject('IVerifyEmailUseCase') private readonly _verifyEmailUseCase: IVerifyEmailUseCase,
        @inject('IResendOtpUseCase') private readonly _resendOtpUseCase: IResendOtpUseCase,
        @inject('ILoginUseCase') private readonly _loginUseCase: ILoginUserUseCase,
        @inject('IRefreshTokenUseCase') private readonly _refreshToken: IRefreshTokenUseCase,
        @inject('ILogoutUserUseCase') private readonly _logoutUseCase: ILogoutUserUseCase,
        @inject('IForgotPasswordUserUseCase') private readonly _forgotPasswordUserUseCase: IForgotPasswordUserUseCase,
        @inject('IResetPasswordUseCase') private readonly _resetPasswordUseCase: IResetPasswordUseCase,
        @inject('IVerifyResetOtpUseCase') private readonly _verifyResetOtpUseCase: IVerifyResetOtpUseCase,
        @inject('IGoogleLoginUseCase') private readonly _googleLoginUseCase: IGoogleLoginUseCase,
        @inject('IGoogleAuthService') private readonly _googleAuthService: IGoogleAuthService
    ) { }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const dto: RegisterUserDTO = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,

            }
            await this._registerUserUseCase.execute(dto);

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.OTP.OTP_SENT });

        } catch (error: unknown) {
            if (error instanceof Error) {
                next(error)
            }

        }
    }

    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        console.log("Entering to th e verify email controller");

        const dto: VerifyEmailDTO = {
            email: req.body.email,
            otp: req.body.otp
        }
        console.log(dto.email, dto.otp)

        await this._verifyEmailUseCase.execute(dto);
        res.status(HTTP_STATUS.OK).json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL })
    }

    resendOtp = async (req: Request, res: Response): Promise<void> => {
        console.log("Entering to th e verify email controller");
        const { email } = req.body;
        await this._resendOtpUseCase.execute(email);
        res.json({ message: MESSAGES.OTP.RESEND_OTP_SUCCESSFULL });

    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const dto: LoginUserDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const response = await this._loginUseCase.execute(dto);

            res.cookie("refreshToken", response.refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: env.REFRESH_TOKEN_MAX_AGE
            })
            logger.info("Login successful", response)

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.LOGIN_SUCCESS, data: response })
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : ERROR_MESSAGES.INVALID_CREDENTIALS;
            logger.error('Login failed', message);
            let status = HTTP_STATUS.UNPROCESSABLE_ENTITY
            res.status(status).json({ message });
        }

    }

    //    googleLogin = async (req: Request, res: Response): Promise<void> => {

    //     const dto : GoogleLoginDTO = {
    //         code: req.body.code,
    //     }

    //     const result = await this._googleLoginUseCase.execute(dto);

    //     res.status(HTTP_STATUS.OK).json({message: MESSAGES.USERS.GOOGLE_LOGIN_SUCCESSFULLY, data: result})

    //    }



    refreshToken = async (req: Request, res: Response): Promise<void> => {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.REFRESH_TOKEN_MISSING });
            return;
        }

        try {
            const dto: RefreshTokenDTO = {
                refreshToken,
            }

            const response = await this._refreshToken.execute(dto)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.REFRESH_TOKEN.REFRESH_SUCCESSFUL, data: response, })
        } catch (error) {
            console.log("REFRESH TOKEN ERROR:", error);

            res.clearCookie("refreshToken");

            const message =
                error instanceof Error
                    ? error.message
                    : ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED;

            console.log("REFRESH TOKEN MESSAGE:", message);

            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message
            });
        }
    }


    forgotPassword = async (req: Request, res: Response): Promise<void> => {

        try {
            const dto: ForgotPasswordDTO = {
                email: req.body.email
            }

            await this._forgotPasswordUserUseCase.execute(dto)
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.USERS.PASSWORD_UPDATED_SUCCESSFULLY })

        } catch (error) {
            const message = error instanceof Error ? error.message : USER_ERRORS.USER_NOT_FOUND;
            res.status(HTTP_STATUS.NOT_FOUND).json({ message })
        }

    }

    verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
        console.log("verify reset otp", req.body)
        await this._verifyResetOtpUseCase.execute(req.body);
        res.json({ message: MESSAGES.OTP.OTP_VERIFIED_SUCCESSFULL });
    };

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        console.log("PasswordReset controller", req.body)

        await this._resetPasswordUseCase.execute(req.body);
        res.json({ message: MESSAGES.USERS.PASSWORD_RESET_SUCCESSFULLY });
    };


    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                await this._logoutUseCase.execute(token)
            }
            res.clearCookie("refreshToken");
            res.json({ message: MESSAGES.USERS.LOGOUT_SECCESS })
        } catch (error) {
            next(error)
        }
    }



    googleRedirect = (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const url = this._googleAuthService.getAuthorizationUrl();

            res.redirect(url);
        } catch (error) {
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
            res.status(400).json({
                message: "Google authorization code is missing",
            });
            return;
        }

        console.log("Google callback code received");

        const response =
            await this._googleLoginUseCase.execute({
                code,
            });

        console.log("Google login successful");

        const { refreshToken } = response;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
        });

        res.redirect(
            `${env.CLIENT_URL}/auth/google/callback`
        );
    } catch (error) {
        next(error);
    }
};



}


