import { useMutation } from "@tanstack/react-query";
import type { SignupFormData } from "../../lib/validations/auth.schema";
import { forgotPassword,login, logout, refreshAccessToken, registerUser, resendOtp, resetPassword, verifyOtp, verifyResetOtp } from "../../services/Auth/authService";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupFormData) => registerUser(data),
  });
};


export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  })
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  })
}
// export const useGoogleLogin = () => {
//   return useMutation({
//     // mutationFn: googleLogin,
//   });
// };

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
  })
}

export const useLogout = ()=> {
  return useMutation({
    mutationFn: logout
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: verifyResetOtp,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};