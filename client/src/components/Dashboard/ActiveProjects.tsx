interface ActiveProjectsProps {
  projects?: Array<{
    id: string;
    name: string;
    manager?: string;
    status: string;
    dueDate?: string;
    progress?: number;
  }>;
}

const ActiveProjects = ({
  projects = [],
}: ActiveProjectsProps) => {
  return (
    <section className="rounded-xl border bg-white">
      <div className="border-b p-5">
        <h2 className="font-semibold text-gray-900">
          Active Projects
        </h2>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No active projects found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Manager</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Progress</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium">
                    {project.name}
                  </td>

                  <td className="px-5 py-4">
                    {project.manager ?? "--"}
                  </td>

                  <td className="px-5 py-4">
                    {project.status}
                  </td>

                  <td className="px-5 py-4">
                    {project.dueDate ?? "--"}
                  </td>

                  <td className="px-5 py-4">
                    {project.progress !== undefined
                      ? `${project.progress}%`
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ActiveProjects;