import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  UserPlus,
} from "lucide-react";
import { useSelector } from "react-redux";

import UserTable from "../../components/Users/UserTable";
import UserDetailsDrawer from "../../components/Users/UserDetailsDrawer";

import {
  useActivateUser,
  useDeactivateUser,
  useGetUsers,
} from "../../hooks/User/UserHooks";

import type { RootState } from "../../store/store";
import type { User } from "../../types/userTypes";
import InviteUserModal from "../../components/modals/Invitations/InviteUserModal";
// import type { User } from "../../types/user.types";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Logged-in user
  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const isAdmin = currentUser?.role === "ADMIN";

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetUsers();

  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();

  const users: User[] = data?.data ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName} ${user.lastName}`.toLowerCase();

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        fullName.includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.isActive) ||
        (statusFilter === "INACTIVE" && !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  // ADMIN can activate a MEMBER
  const handleActivate = (id: string) => {
    if (!isAdmin) {
      return;
    }

    activateMutation.mutate(id, {
      onSuccess: () => {
        setSelectedUser((current) =>
          current
            ? {
                ...current,
                isActive: true,
              }
            : null
        );
      },
    });
  };

  // ADMIN can deactivate a MEMBER,
  // but cannot deactivate himself
  const handleDeactivate = (id: string) => {
    if (!isAdmin) {
      return;
    }

    if (id === currentUser?._id) {
      return;
    }

    deactivateMutation.mutate(id, {
      onSuccess: () => {
        setSelectedUser((current) =>
          current
            ? {
                ...current,
                isActive: false,
              }
            : null
        );
      },
    });
  };

  const isStatusUpdating =
    activateMutation.isPending ||
    deactivateMutation.isPending;

  const handleSelectUser = (user: User) => {
    // Only ADMIN can open user details
    if (!isAdmin) {
      return;
    }

    setSelectedUser(user);
  };

  const handleInviteUser = () => {
    if (!isAdmin) {
      return;
    }

setIsInviteModalOpen(true)  
};

  return (
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>Organization</span>
              <span>/</span>
              <span className="text-slate-700">
                Users
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage organization members, roles, and access.
            </p>
          </div>

          {/* ADMIN ONLY */}
          {isAdmin && (
            <button
              type="button"
              onClick={handleInviteUser}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <UserPlus size={18} />
              Invite User
            </button>
          )}
        </div>

        {/* Main layout */}
        <div
          className={`grid gap-6 ${
            isAdmin && selectedUser
              ? "lg:grid-cols-[minmax(0,1fr)_420px]"
              : "grid-cols-1"
          }`}
        >

          {/* Main content */}
          <div className="min-w-0">

            {/* Controls */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row">

                {/* Search */}
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                {/* Role */}
                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                </select>

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                {/* More Filters */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Filter size={17} />
                  More Filters
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                <div className="text-sm text-slate-500">
                  Loading users...
                </div>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h3 className="font-semibold text-red-700">
                  Failed to load users
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while fetching users."}
                </p>
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
              <>
                <UserTable
                  users={filteredUsers}
                  selectedUserId={
                    selectedUser?._id ?? null
                  }
                  onSelectUser={handleSelectUser}
                  isAdmin={isAdmin}
                />

                {/* Pagination */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {filteredUsers.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                      {users.length}
                    </span>{" "}
                    members
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      className="rounded-lg border border-slate-200 p-2 text-slate-400"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                      1
                    </button>

                    <button
                      disabled
                      className="rounded-lg border border-slate-200 p-2 text-slate-400"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop drawer - ADMIN ONLY */}
          {isAdmin && selectedUser && (
            <div className="hidden lg:block">
              <div className="sticky top-6">
                <UserDetailsDrawer
                  user={selectedUser}
                  currentUserId={currentUser?._id ?? ""}
                  onClose={() => setSelectedUser(null)}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  isUpdating={isStatusUpdating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile drawer - ADMIN ONLY */}
        {isAdmin && selectedUser && (
          <div className="lg:hidden">
            <UserDetailsDrawer
              user={selectedUser}
              currentUserId={currentUser?._id ?? ""}
              onClose={() => setSelectedUser(null)}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              isUpdating={isStatusUpdating}
            />
          </div>
        )}
      </div>
      {isAdmin && isInviteModalOpen && (
  <InviteUserModal
    onClose={() => setIsInviteModalOpen(false)}
  />
)}
    </div>
    



  );

};

export default UsersPage;