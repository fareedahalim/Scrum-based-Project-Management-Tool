interface DepartmentTeamsProps {
  teams?: Array<{
    id: string;
    name: string;
    memberCount: number;
  }>;
}

const DepartmentTeams = ({
  teams = [],
}: DepartmentTeamsProps) => {
  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="font-semibold text-gray-900">
          Teams
        </h2>
      </div>

      {teams.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No teams found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border p-4"
            >
              <h3 className="font-medium">
                {team.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {team.memberCount} members
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DepartmentTeams;