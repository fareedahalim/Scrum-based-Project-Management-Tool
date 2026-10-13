
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  useLogin,
} from "../../hooks/Auth/AuthHooks";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  loginSchema,
  type LoginFormData,
} from "../../lib/validations/auth.loginSchema";

import { setAccessToken } from "../../store/slice/tokenSlice";
import { setUser } from "../../store/slice/authSlice";

import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

import { getOrganization } from "../../services/Organization/organizationService";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ----------------------------------------
  // React Hook Form
  // ----------------------------------------

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  // ----------------------------------------
  // Normal Login Mutation
  // ----------------------------------------

  const {
    mutate: login,
    isPending,
  } = useLogin();

  // ----------------------------------------
  // Google Login
  // ----------------------------------------
  //
  // Google authentication is now handled by
  // the backend.
  //
  // Frontend
  //     ↓
  // GET /api/auth/google
  //     ↓
  // Google
  //     ↓
  // Backend callback
  //     ↓
  // Frontend GoogleCallbackPage
  //
  // ----------------------------------------

  const handleGoogleLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  // ----------------------------------------
  // Normal Login Submit
  // ----------------------------------------

  const onSubmit = (values: LoginFormData) => {
    login(values, {
      onSuccess: async (response) => {
        if (response.data) {
          dispatch(
            setAccessToken(response.data.accessToken)
          );

          dispatch(
            setUser(response.data.user)
          );
        }

        try {
          await getOrganization();

          // Organization already exists
          toast.success("Login successful!");

          navigate(FRONTEND_ROUTES.DASHBOARD, {
            replace: true,
          });
        } catch (error: any) {
          // Organization does not exist yet
          if (error?.response?.status === 404) {
            toast.success("Login successful!");

            navigate(
              FRONTEND_ROUTES.ORGANIZATION_SETUP,
              {
                replace: true,
              }
            );

            return;
          }

          // Some other error occurred
          console.error(
            "Organization check failed:",
            error
          );

          toast.error(
            "Unable to check organization setup."
          );
        }
      },

      onError: (error: any) => {
        console.error(
          "Login error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          "Login failed. Please try again.";

        toast.error(message);
      },
    });
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <Card
      className="
        relative
        w-full
        max-w-[500px]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        py-0
        shadow-[0_20px_60px_rgba(37,99,235,0.10)]
      "
    >
      {/* Top gradient line */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-1
          bg-gradient-to-r
          from-blue-600
          via-violet-500
          to-purple-500
        "
      />

      {/* HEADER */}

      <CardHeader className="px-8 pb-4 pt-8 text-center">
        <CardTitle className="flex justify-center">
          <img
            src="/logo.png"
            alt="Nexora Logo"
            className="h-14 w-auto object-contain"
          />
        </CardTitle>

        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to continue managing your projects
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {/* LOGIN FORM */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* EMAIL */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="
                  absolute
                  left-3
                  top-1/2
                  z-10
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <Input
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    FRONTEND_ROUTES.FORGOT_PASSWORD
                  )
                }
                className="
                  text-xs
                  font-medium
                  text-blue-600
                  hover:text-blue-700
                  hover:underline
                "
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  z-10
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <Input
                type="password"
                placeholder="Enter your password"
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

          {/* REMEMBER ME */}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="
                h-4
                w-4
                rounded
                border-slate-300
                text-blue-600
                focus:ring-blue-500
              "
            />

            <span className="text-sm text-slate-500">
              Remember me
            </span>
          </div>

          {/* LOGIN BUTTON */}

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="
              h-11
              rounded-lg
              bg-blue-600
              shadow-lg
              shadow-blue-600/20
              hover:bg-blue-700
              hover:shadow-blue-600/30
            "
          >
            {isPending
              ? "Signing in..."
              : "Sign In"}
          </Button>
        </form>

        {/* DIVIDER */}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* GOOGLE LOGIN */}

        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleGoogleLogin}
          className="
            h-11
            w-full
            rounded-lg
            border-slate-200
            bg-white
            hover:bg-slate-50
          "
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 4.74-3.28 8.09-3.28z"
            />

            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />

            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />

            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          Continue with Google
        </Button>

        {/* SIGNUP */}

        <div className="mt-5 border-t border-slate-100 pt-5 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={() =>
                navigate(FRONTEND_ROUTES.SIGNUP)
              }
              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              Create Account
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

