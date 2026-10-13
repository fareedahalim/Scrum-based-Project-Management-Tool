import { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  UserPlus,
  MoreVertical,
} from "lucide-react";

import { useGetInvitations } from "../../hooks/Invitation/InvitationHooks";

import type {
  Invitation,
  InvitationStatus,
} from "../../types/invitationTypes";

import InvitationActionModal from "../../components/modals/Invitations/InvitationActionModal";

const InvitationsPage = () => {
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<InvitationStatus | "ALL">("ALL");

  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetInvitations();

  const invitations: Invitation[] = data?.data ?? [];

  // Filter invitations
  const filteredInvitations = useMemo(() => {
    return invitations.filter(
      (invitation: Invitation) => {
        const matchesSearch =
          invitation.email
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesStatus =
          status === "ALL" ||
          invitation.status === status;

        return matchesSearch && matchesStatus;
      }
    );
  }, [invitations, search, status]);

  // Status badge
  const getStatusClass = (
    invitationStatus: InvitationStatus
  ) => {
    switch (invitationStatus) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Invitations
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage invitations sent to users.
          </p>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isFetching ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row">

        {/* Search */}
        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />

        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | InvitationStatus
                | "ALL"
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="ACCEPTED">
            Accepted
          </option>

          <option value="EXPIRED">
            Expired
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>

      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">

          <span>
            Failed to load invitations.
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 font-medium underline"
          >
            Try again
          </button>

        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px]">

            {/* Table Header */}
            <thead className="border-b bg-gray-50">

              <tr>

                {/* Email */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                {/* Role */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                {/* Status */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                {/* Expires */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Expires
                </th>

                {/* Created */}
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created
                </th>

                {/* Action */}
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {/* Loading */}
              {isLoading && (
                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Loading invitations...
                  </td>

                </tr>
              )}

              {/* Empty */}
              {!isLoading &&
                !isError &&
                filteredInvitations.length === 0 && (
                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center"
                    >

                      <UserPlus
                        size={30}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        No invitations found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Try changing your search or
                        status filter.
                      </p>

                    </td>

                  </tr>
                )}

              {/* Invitation Rows */}
              {!isLoading &&
                !isError &&
                filteredInvitations.map(
                  (invitation: Invitation) => (
                    <tr
                      key={invitation._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Email */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {invitation.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {invitation.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            invitation.status
                          )}`}
                        >
                          {invitation.status}
                        </span>

                      </td>

                      {/* Expires */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(
                            invitation.expiresAt
                          )}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(
                            invitation.createdAt
                          )}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">

                        {invitation.status ===
                          "PENDING" && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedInvitation(
                                invitation
                              )
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            title="Invitation actions"
                          >
                            <MoreVertical
                              size={18}
                            />
                          </button>
                        )}

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Invitation Action Modal */}
      {selectedInvitation && (
        <InvitationActionModal
          invitation={selectedInvitation}
          onClose={() =>
            setSelectedInvitation(null)
          }
        />
      )}

    </div>
  );
};

export default InvitationsPage;