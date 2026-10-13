import Router from "express";
import { env } from "../../../config/env";
import { ROUTES } from "../../../shared/constant/routes";
import { success } from "zod";
import { validateRequest } from "../../middlewares/validator";
import { forgotPasswordSchema, googleLoginSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyEmailSchema, verifyResetOtpSchema } from "../../validation/auth.validation";
import { authController, authMiddleware } from "../../DI/resolver";
import { runInContext } from "node:vm";

const router = Router();

// router.post(ROUTES.AUTH.REGISTER, validateRequest(registerSchema), authController.register)
router.post(
    ROUTES.AUTH.REGISTER,
    validateRequest(registerSchema),
    (req, res, next) => {
        console.log("Entering register controller route");
        return authController.register(req, res, next);
    }
);
router.post(ROUTES.AUTH.VERIFY_EMAIL,validateRequest(verifyEmailSchema), authController.verifyEmail)

// router.post(ROUTES.AUTH.VERIFY_EMAIL,validateRequest(verifyEmailSchema),(req,res,next)=>{
//             console.log("Entering verifyEmail controller route");
//             return authController.verifyEmail(req,res)

// })

router.post(ROUTES.AUTH.RESEND_OTP,validateRequest(resendOtpSchema), authController.resendOtp)

router.post(ROUTES.AUTH.LOGIN, validateRequest(loginSchema), authController.login);

// router.post(ROUTES.AUTH.GOOGLE, validateRequest(googleLoginSchema), authController.googleLogin)

router.get(
    ROUTES.AUTH.GOOGLE,
    authController.googleRedirect
);

router.get(
    ROUTES.AUTH.GOOGLE_CALLBACK,
    authController.googleCallback
);

router.post(ROUTES.AUTH.REFRESH_TOKEN,authController.refreshToken)

router.post(ROUTES.AUTH.FORGOT_PASSWORD,validateRequest(forgotPasswordSchema), authController.forgotPassword)

router.post(ROUTES.AUTH.LOGOUT,authMiddleware.authenticate,authController.logout)

router.post(ROUTES.AUTH.VERIFY_RESET_OTP, validateRequest(verifyResetOtpSchema), authController.verifyResetOtp);

router.post(ROUTES.AUTH.RESET_PASSWORD, validateRequest(resetPasswordSchema), authController.resetPassword);

export default router;