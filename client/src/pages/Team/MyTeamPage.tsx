import { Users, UserRound, Mail, CalendarDays } from "lucide-react";
import { useGetMyTeam } from "../../hooks/Team/TeamHook";

const MyTeamPage = () => {
  const {
    data: team,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyTeam();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">Loading your team...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-700">
          Failed to load your team.
        </p>
        <p className="mt-1 text-sm text-red-600">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          You are not assigned to a team yet
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Please contact your organization admin to join a team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Team
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your team details, team lead, and teammates.
        </p>
      </div>

      {/* Team details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-indigo-100 p-3">
            <Users className="h-7 w-7 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {team.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {team.description || "No team description available."}
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Created on{" "}
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Team lead */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Team Lead
        </h2>

        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          {team.lead.profileImage ? (
            <img
              src={team.lead.profileImage}
              alt={`${team.lead.firstName} ${team.lead.lastName}`}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <UserRound className="h-7 w-7 text-indigo-600" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">
              {team.lead.firstName} {team.lead.lastName}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Mail size={15} />
              {team.lead.email}
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            Team Lead
          </span>
        </div>
      </section>

      {/* Team members */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Team Members
          </h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            {team.members.length} members
          </span>
        </div>

        {team.members.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No team members found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {team.members.map((member) => {
              const isLead = member.id === team.lead.id;

              return (
                <div
                  key={member.id}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <UserRound className="h-6 w-6 text-gray-500" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="mt-1 flex items-center gap-1 truncate text-sm text-gray-500">
                        <Mail size={14} />
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isLead
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isLead ? "Team Lead" : "Member"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyTeamPage;