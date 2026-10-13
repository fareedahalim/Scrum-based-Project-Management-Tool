import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Check,
  Mail,
  User,
  X,
  Phone,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useSignup } from "../../hooks/Auth/AuthHooks";

import {
  signupSchema,
  type SignupFormData,
} from "../../lib/validations/auth.schema";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { cn } from "../../lib/cn";

const PASSWORD_RULES = [
  {
    label: "Minimum 8 characters",
    test: (password: string) =>
      password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) =>
      /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) =>
      /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) =>
      /[0-9]/.test(password),
  },
  {
    label: "One special character",
    test: (password: string) =>
      /[^A-Za-z0-9]/.test(password),
  },
];

const STRENGTH_LABELS = [
  "Very weak",
  "Weak",
  "Fair",
  "Good",
  "Strong",
];

const STRENGTH_COLORS = [
  "bg-red-400",
  "bg-red-400",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-emerald-500",
];

interface SignupFormProps {
  onSwitchToSignIn?: () => void;
  onSubmit: (data: SignupFormData) => void;
  isLoading?: boolean;
  
}

const SignupForm = ({onSwitchToSignIn, onSubmit, isLoading }: SignupFormProps) => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },

    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  
  const password =
    useWatch({
      control,
      name: "password",
    }) ?? "";

  const passedCount = PASSWORD_RULES.filter(
    (rule) => rule.test(password)
  ).length;

  const strengthIndex =
    password.length > 0
      ? Math.max(0, passedCount - 1)
      : 0;

  // const onSubmit = (values: SignupFormData) => {
  //   signup(values, {
  //     onSuccess: (response) => {
  //       console.log("Signup response:", response);

  //       toast.success(
  //         "Account created successfully!"
  //       );

  //       onSuccess?.(values.email);
  //     },

  //     onError: (error) => {
  //       console.error("Signup error:", error);

  //       toast.error(
  //         "Signup failed. Please try again."
  //       );
  //     },
  //   });
  // };

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
      {/* Blue → Purple top line */}

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
            Create Your Account
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Start managing your projects with Nexora
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* FIRST + LAST NAME */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                First Name
              </label>

              <div className="relative">
                <User
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
                  placeholder="First Name"
                  className="pl-10"
                  {...register("firstName")}
                />
              </div>

              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Last Name
              </label>

              <div className="relative">
                <User
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
                  placeholder="Last Name"
                  className="pl-10"
                  {...register("lastName")}
                />
              </div>

              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

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

          {/* PHONE */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone Number
              <span className="ml-1 text-xs font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <div className="relative">
              <Phone
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
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                {...register("phone")}
              />
            </div>

            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>

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
                placeholder="Create a strong password"
                className="pl-10"
                {...register("password")}
              />
            </div>

            {/* PASSWORD STRENGTH */}

            {password.length > 0 && (
              <div className="mt-3 space-y-2.5">
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <span
                        key={index}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          index < passedCount
                            ? STRENGTH_COLORS[
                                strengthIndex
                              ]
                            : "bg-slate-200"
                        )}
                      />
                    )
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Password strength:{" "}
                  <span className="font-semibold text-slate-700">
                    {
                      STRENGTH_LABELS[
                        strengthIndex
                      ]
                    }
                  </span>
                </p>

                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {PASSWORD_RULES.map(
                    (rule) => {
                      const passed =
                        rule.test(password);

                      return (
                        <li
                          key={rule.label}
                          className={cn(
                            "flex items-center gap-1.5 text-xs",
                            passed
                              ? "text-emerald-600"
                              : "text-slate-400"
                          )}
                        >
                          {passed ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}

                          {rule.label}
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>

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
                placeholder="Re-enter your password"
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

          {/* TERMS */}

          

          {/* CREATE ACCOUNT */}

          <Button
            type="submit"
            isLoading={isLoading}
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
            {isLoading
              ? "Creating account..."
              : "Create Account"}
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

        {/* GOOGLE */}

        <Button
          type="button"
          variant="outline"
          className="
            h-11
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
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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

        {/* TERMS */}

        {/* <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p> */}

        {/* LOGIN */}

        <div className="mt-5 border-t border-slate-100 pt-5 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
              "
            >
              Sign In
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;