import {
  CheckCircle2,
  CircleUserRound,
  Mail,
  Shield,
} from "lucide-react";
import type { User } from "../../types/userTypes";


interface UserTableProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (user: User) => void;
  isAdmin: boolean;
}

const UserTable = ({
  users,
  selectedUserId,
  onSelectUser,
  isAdmin,
}: UserTableProps) => {
  const getInitials = (
    firstName: string,
    lastName: string
  ) => {
    return `${firstName.charAt(0)}${lastName.charAt(
      0
    )}`.toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">

          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                User
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email Verified
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {users.map((user) => {
              const isSelected =
                selectedUserId === user._id;

              return (
                <tr
                  key={user._id}
                  onClick={
                    isAdmin
                      ? () => onSelectUser(user)
                      : undefined
                  }
                  className={`transition ${
                    isAdmin
                      ? `cursor-pointer ${
                          isSelected
                            ? "bg-slate-50"
                            : "hover:bg-slate-50"
                        }`
                      : ""
                  }`}
                >

                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                          {getInitials(
                            user.firstName,
                            user.lastName
                          )}
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-slate-900">
                          {user.firstName}{" "}
                          {user.lastName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <Shield size={13} />
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-medium ${
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
                    </span>
                  </td>

                  {/* Email verified */}
                  <td className="px-6 py-4">
                    {user.isEmailVerified ? (
                      <span className="flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle2 size={16} />
                        Verified
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Not verified
                      </span>
                    )}
                  </td>

                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <CircleUserRound
            size={40}
            className="mb-3 text-slate-300"
          />

          <h3 className="font-medium text-slate-900">
            No users found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;