interface StatsGridProps {
  totalUsers?: number;
  activeProjects?: number;
  totalTeams?: number;
  pendingInvites?: number;
  projectManagers?: number;
}

const StatsGrid = ({
  totalUsers,
  activeProjects,
  totalTeams,
  pendingInvites,
  projectManagers,
}: StatsGridProps) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
    },
    {
      title: "Active Projects",
      value: activeProjects,
    },
    {
      title: "Total Teams",
      value: totalTeams,
    },
    {
      title: "Pending Invites",
      value: pendingInvites,
    },
    {
      title: "Project Managers",
      value: projectManagers,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border bg-white p-5"
        >
          <p className="text-sm text-gray-500">
            {stat.title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stat.value ?? "--"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
// For now it displays -- because the backend data isn't connected.

// Later:

// <StatsGrid
//   totalUsers={dashboardData.totalUsers}
//   activeProjects={dashboardData.activeProjects}
//   totalTeams={dashboardData.totalTeams}
//   pendingInvites={dashboardData.pendingInvites}
//   projectManagers={dashboardData.projectManagers}
// />

// Those values will come from your backend.