import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";

import {
  acceptInvitationSchema,
  type AcceptInvitationFormData,
} from "../../lib/validations/invitation.schema";

import { useAcceptInvitation } from "../../hooks/Invitation/InvitationHooks";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";

const AcceptInvitationPage = () => {
  const { token } = useParams<{
    token: string;
  }>();

  const navigate = useNavigate();

  const acceptInvitationMutation =
    useAcceptInvitation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(
      acceptInvitationSchema
    ),
  });

  const onSubmit = async (
    data: AcceptInvitationFormData
  ) => {
    if (!token) {
      toast.error(
        "Invalid invitation link"
      );
      return;
    }

    try {
      await acceptInvitationMutation.mutateAsync({
        token,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
toast.success("Invitation accepted successfully");

navigate(FRONTEND_ROUTES.LOGIN, {
  replace: true,
});

      
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to accept invitation";

      toast.error(message);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Invalid Invitation
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The invitation link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-sm">

        {/* Header */}
        <div className="border-b px-6 py-6 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <UserPlus
              size={22}
              className="text-gray-700"
            />
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Join Nexora
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You have been invited to join the
            organization. Create your account to
            continue.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6 sm:p-8"
        >

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              placeholder="9876543210"
              {...register("phone")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register("password")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              acceptInvitationMutation.isPending
            }
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {acceptInvitationMutation.isPending
              ? "Creating Account..."
              : "Accept Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;