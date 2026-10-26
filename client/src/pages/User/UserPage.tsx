
import { useState } from "react";
import toast from "react-hot-toast";
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
import InviteUserModal from "../../components/modals/Invitations/InviteUserModal";

import {
  useActivateUser,
  useDeactivateUser,
  useGetUsers,
} from "../../hooks/User/UserHooks";

import type { RootState } from "../../store/store";
import type {
  User,
  GetUsersParams,
} from "../../types/userTypes";

const PAGE_SIZE = 10;

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<GetUsersParams["role"]>("ALL");
  const [statusFilter, setStatusFilter] =
    useState<GetUsersParams["status"]>("ALL");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] =
    useState(false);

  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  const isAdmin = currentUser?.role === "ADMIN";

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUsers({
    search,
    role: roleFilter,
    status: statusFilter,
    page,
    limit: PAGE_SIZE,
  });

  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();

  const users: User[] = data?.data ?? [];
  const pagination = data?.pagination;

  const total = pagination?.total ?? 0;
  const totalPages = Math.max(
    pagination?.totalPages ?? 0,
    1
  );

  const handleActivate = (id: string) => {
    if (!isAdmin) return;

    activateMutation.mutate(id, {
      onSuccess: () => {
        setSelectedUser((current) =>
          current
            ? { ...current, isActive: true }
            : null
        );
      },
    });
  };

  
const handleDeactivate = (id: string) => {
  if (!isAdmin || id === currentUser?._id) return;

  deactivateMutation.mutate(id, {
    onSuccess: () => {
      setSelectedUser((current) =>
        current ? { ...current, isActive: false } : null
      );

      toast.success("Member deactivated successfully.");
    },

    onError: (error: unknown) => {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };

      const errorMessage =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        apiError.message ||
        "Unable to deactivate this member.";

      toast.error(errorMessage);
    },
  });
};


  const isStatusUpdating =
    activateMutation.isPending ||
    deactivateMutation.isPending;

  const handleSelectUser = (user: User) => {
    if (!isAdmin) return;
    setSelectedUser(user);
  };

  const handleInviteUser = () => {
    if (!isAdmin) return;
    setIsInviteModalOpen(true);
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (
    value: GetUsersParams["role"]
  ) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: GetUsersParams["status"]
  ) => {
    setStatusFilter(value);
    setPage(1);
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
          <div className="min-w-0">
            {/* Search and filters */}
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      handleSearchChange(event.target.value)
                    }
                    placeholder="Search by name or email..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(event) =>
                    handleRoleChange(
                      event.target.value as GetUsersParams["role"]
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MEMBER">Member</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    handleStatusChange(
                      event.target.value as GetUsersParams["status"]
                    )
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("ALL");
                    setStatusFilter("ALL");
                    setPage(1);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Filter size={17} />
                  Clear Filters
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

            {/* Table and pagination */}
            {!isLoading && !isError && (
              <>
                <UserTable
                  users={users}
                  selectedUserId={selectedUser?._id ?? null}
                  onSelectUser={handleSelectUser}
                  isAdmin={isAdmin}
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {users.length > 0
                        ? (page - 1) * PAGE_SIZE + 1
                        : 0}
                      {"–"}
                      {(page - 1) * PAGE_SIZE + users.length}
                    </span>
                    {" "}of{" "}
                    <span className="font-medium text-slate-700">
                      {total}
                    </span>
                    {" "}users
                    {isFetching && " · Updating..."}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1 || isFetching}
                      onClick={() =>
                        setPage((current) => current - 1)
                      }
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <span className="px-3 text-sm font-medium text-slate-700">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        page >= totalPages || isFetching
                      }
                      onClick={() =>
                        setPage((current) => current + 1)
                      }
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop drawer */}
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

        {/* Mobile drawer */}
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

      {/* Invitation modal */}
      {isAdmin && isInviteModalOpen && (
        <InviteUserModal
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersPage;
