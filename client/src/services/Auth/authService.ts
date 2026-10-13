import { AxiosInstance } from "../../axios/axios";
import { API_ROUTES } from "../../constants/apiRoutes";
import { resetPasswordSchema } from "../../lib/validations/auth.resetPasswordSchema";

//Register//
export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};
export const registerUser = async (data: RegisterPayload) => {

  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.REGISTER,
    data
  );

  return response.data;
};

//verifyOtp//
interface verifyOtpPayload {
  email: string,
  otp: string,
}

export const verifyOtp = async (data: verifyOtpPayload) => {
  console.log(" verify otp",data)
  const response = await AxiosInstance.post(API_ROUTES.AUTH.VERIFY_EMAIL, data);
  return response.data;
}

//resendOtp//
interface resendOtpPayload {
  email: string
}

export const resendOtp = async (data: resendOtpPayload) => {
  console.log("Entering the resend",data)
  const response = await AxiosInstance.post(API_ROUTES.AUTH.RESEND_OTP,data);
  return response.data;
}

//login//
interface loginPayload {
  email: string,
  password: string
}

export const login = async (data: loginPayload) => {
  console.log("entering login api",data)
  const response = await AxiosInstance.post(API_ROUTES.AUTH.LOGIN, data);
  return response.data;
}

//refresh-Token
export const refreshAccessToken = async () => {
  const response = await AxiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,{},
    // {
    //   withCredentials: true,
    // }
    {}
  )
  return response.data;
}

//forgotPassword

export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword  =async (data: ForgotPasswordPayload) => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD, data);
  return response.data;
} 

// Verify Reset OTP

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}
export const verifyResetOtp = async (
  data: VerifyResetOtpPayload
) => {
  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.VERIFY_RESET_OTP,
    data
  );

  return response.data;
};

// Reset Password
export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export const resetPassword = async (
  data: ResetPasswordPayload
) => {
    console.log("entering resetPassword api",data)

  const response = await AxiosInstance.post(
    API_ROUTES.AUTH.RESET_PASSWORD,
    data
  );

  return response.data;
};


// //GoogleLogin
// interface GoogleLoginPayload {
//   code: string;
// }
// export const googleLogin = async (data: GoogleLoginPayload) => {
//   console.log("google api ",data)
//   const response = await AxiosInstance.post(
//     API_ROUTES.AUTH.GOOGLE_LOGIN,
//     data
//   );
// console.log("googleLogin",response.data)

//   return response.data;
// };


//logout

export const logout = async () => {
  const response = await AxiosInstance.post(API_ROUTES.AUTH.LOGOUT)
  return response.data
}