import {
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  X,
} from "lucide-react";
import type { User } from "../../types/userTypes";


interface UserDetailsDrawerProps {
  user: User | null;
  currentUserId: string;
  onClose: () => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  isUpdating: boolean;
}

const UserDetailsDrawer = ({
  user,
  currentUserId,
  onClose,
  onActivate,
  onDeactivate,
  isUpdating,
}: UserDetailsDrawerProps) => {
  if (!user) {
    return null;
  }

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isCurrentUser =
    user._id === currentUserId;

  const isAdminUser =
    user.role === "ADMIN";

  const canDeactivate =
    user.isActive &&
    !isCurrentUser &&
    !isAdminUser;

  const canActivate =
    !user.isActive &&
    !isAdminUser;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            User Details
          </h2>

          <p className="text-sm text-slate-500">
            View account information
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {/* Profile */}
        <div className="flex flex-col items-center border-b border-slate-200 pb-6 text-center">

          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700">
              {getInitials()}
            </div>
          )}

          <h3 className="mt-4 text-xl font-semibold text-slate-900">
            {user.firstName} {user.lastName}
          </h3>

          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            <Shield size={13} />
            {user.role}
          </span>

          <div
            className={`mt-3 flex items-center gap-2 text-sm font-medium ${
              user.isActive
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                user.isActive
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />

            {user.isActive
              ? "Active"
              : "Inactive"}
          </div>
        </div>

        {/* Contact */}
        <section className="border-b border-slate-200 py-6">
          <h4 className="mb-4 text-sm font-semibold text-slate-900">
            Contact Information
          </h4>

          <div className="space-y-4">

            <div className="flex gap-3">
              <Mail
                size={18}
                className="mt-0.5 text-slate-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-800">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone
                size={18}
                className="mt-0.5 text-slate-400"
              />

              <div>
                <p className="text-xs text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-800">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Account information */}
        <section className="border-b border-slate-200 py-6">
          <h4 className="mb-4 text-sm font-semibold text-slate-900">
            Account Information
          </h4>

          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Email verification
              </span>

              <span
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  user.isEmailVerified
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                {user.isEmailVerified && (
                  <CheckCircle2 size={16} />
                )}

                {user.isEmailVerified
                  ? "Verified"
                  : "Not verified"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Created
              </span>

              <span className="text-sm font-medium text-slate-800">
                {formatDate(user.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Last updated
              </span>

              <span className="text-sm font-medium text-slate-800">
                {formatDate(user.updatedAt)}
              </span>
            </div>

          </div>
        </section>

        {/* Project and team information */}
        <section className="py-6">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Project & Team Assignments
          </h4>

          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Project and team assignments will appear here
              after the project membership module is implemented.
            </p>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-6">

        {/* Cannot deactivate yourself */}
        {isCurrentUser && user.isActive && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <p className="text-sm font-medium text-slate-700">
              You cannot deactivate your own account.
            </p>
          </div>
        )}

        {/* Cannot deactivate ADMIN */}
        {!isCurrentUser &&
          isAdminUser &&
          user.isActive && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-sm font-medium text-slate-700">
                The administrator account cannot be
                deactivated.
              </p>
            </div>
          )}

        {/* Deactivate MEMBER */}
        {canDeactivate && (
          <button
            type="button"
            onClick={() =>
              onDeactivate(user._id)
            }
            disabled={isUpdating}
            className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Deactivating..."
              : "Deactivate Member"}
          </button>
        )}

        {/* Activate MEMBER */}
        {canActivate && (
          <button
            type="button"
            onClick={() =>
              onActivate(user._id)
            }
            disabled={isUpdating}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Activating..."
              : "Activate Member"}
          </button>
        )}

      </div>
    </aside>
  );
};

export default UserDetailsDrawer;