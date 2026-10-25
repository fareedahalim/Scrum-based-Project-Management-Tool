
import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight } from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

// import { useGetProjects } from "../../hooks/Project/ProjectHooks";
import { useGetProjectMembers } from "../../hooks/Project/ProjectMemberHook";

import type { Project } from "../../types/projectTypes";
import { useGetProjects } from "../../hooks/Project/ProjectHook";

interface ProjectMembershipCheckProps {
    project: Project;
    currentUserId: string;
}

const ProjectMembershipCheck = ({
    project,
    currentUserId,
}: ProjectMembershipCheckProps) => {
    const {
        data: membersData,
        isLoading,
        isError,
    } = useGetProjectMembers(project.id);

    if (isLoading || isError || !membersData) {
        return null;
    }

    const isProductOwner = membersData.members.some(
        (member) =>
            String(member.userId) === currentUserId &&
            member.scrumRole === "PRODUCT_OWNER" &&
            member.status === "ACTIVE"
    );

    if (!isProductOwner) {
        return null;
    }

    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {project.key}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-gray-900">
                        {project.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {project.description || "No description available."}
                    </p>
                </div>

                <FolderKanban
                    size={22}
                    className="shrink-0 text-gray-500"
                />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {project.status.replaceAll("_", " ")}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {project.priority}
                </span>
            </div>

            <Link
                to={`/projects/${project.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
                View project
                <ArrowRight size={16} />
            </Link>
        </article>
    );
};

const ProductOwnerProjects = () => {
    const currentUser = useSelector(
        (state: RootState) => state.auth.user
    );

    const {
        data: projects,
        isLoading,
        isError,
        refetch,
    } = useGetProjects();

    const currentUserId = currentUser
        ? ("id" in currentUser
            ? String(currentUser.id)
            : String(currentUser._id ?? ""))
        : "";

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
                Loading your projects...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center">
                <p className="text-sm text-red-600">
                    Unable to load projects.
                </p>

                <button
                    type="button"
                    onClick={() => void refetch()}
                    className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!currentUserId) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
                Unable to identify the logged-in user.
            </div>
        );
    }

    if (!projects?.length) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
                No projects are available.
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                    My Product Owner Projects
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Projects where you are assigned as Product Owner.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {projects.map((project) => (
                    <ProjectMembershipCheck
                        key={project.id}
                        project={project}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProductOwnerProjects;
