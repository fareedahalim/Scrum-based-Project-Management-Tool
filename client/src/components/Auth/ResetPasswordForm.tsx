import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";


import { useResetPassword } from "../../hooks/Auth/AuthHooks";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { resetPasswordSchema, type ResetPasswordFormData } from "../../lib/validations/auth.resetPasswordSchema";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const {
    mutate: resetPassword,
    isPending,
  } = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error(
        "Password reset session is invalid"
      );

      navigate(FRONTEND_ROUTES.FORGOT_PASSWORD);
      return;
    }

    resetPassword(
  {
    email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message ||
              "Password reset successfully"
          );

          navigate(FRONTEND_ROUTES.LOGIN, {
            replace: true,
          });
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Unable to reset password"
          );
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white shadow-lg">
      <CardHeader className="px-8 pb-4 pt-8 text-center">
        <CardTitle className="flex justify-center">
          <img
            src="/logo.png"
            alt="Nexora Logo"
            className="h-14 w-auto object-contain"
          />
        </CardTitle>

        <div className="mt-3">
          <h1 className="text-2xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a new password for your account.
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Password */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="password"
                placeholder="Enter new password"
                className="pl-10"
                {...register("password")}
              />
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <Input
                type="password"
                placeholder="Confirm your new password"
                className="pl-10"
                {...register("confirmPassword")}
              />
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isPending}
            className="h-11 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            {isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;