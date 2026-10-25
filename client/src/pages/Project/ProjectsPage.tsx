
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FolderKanban,
    Plus,
    CalendarDays,
    Users,
    ArrowUpRight,
} from "lucide-react";

import type { RootState } from "../../store/store";

import { useGetProjects } from "../../hooks/Project/ProjectHook";
import { useGetTeams } from "../../hooks/Team/TeamHook";
import { useGetProjectMembers } from "../../hooks/Project/ProjectMemberHook";

import type {
    Project,
    ProjectPriority,
    ProjectStatus,
} from "../../types/projectTypes";

import type { ProjectMember } from "../../services/Project/projectMemberService";

import CreateProjectModal from "../../components/modals/Project/CreateProjectModal";

// --------------------------------------------------
// Project membership access check
// --------------------------------------------------

interface ProjectAccessCheckProps {
    project: Project;
    currentUserId: string;
    onAccess: (projectId: string, hasAccess: boolean) => void;
}

const ProjectAccessCheck = ({
    project,
    currentUserId,
    onAccess,
}: ProjectAccessCheckProps) => {
    const { data, isLoading, isError } = useGetProjectMembers(project.id);

    useEffect(() => {
        if (isLoading) return;

        if (isError || !data) {
            onAccess(project.id, false);
            return;
        }

        const hasAccess = data.members.some(
            (member: ProjectMember) =>
                String(member.userId) === currentUserId &&
                member.status === "ACTIVE"
        );

        onAccess(project.id, hasAccess);
    }, [
        data,
        currentUserId,
        isLoading,
        isError,
        project.id,
        onAccess,
    ]);

    return null;
};

// --------------------------------------------------
// Projects page
// --------------------------------------------------

const ProjectsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [accessibleProjectIds, setAccessibleProjectIds] = useState<
        Record<string, boolean>
    >({});

    const user = useSelector((state: RootState) => state.auth.user);

    const isAdmin = user?.role === "ADMIN";

    // Support either `id` or `_id` in the logged-in user object.
    const currentUserId = user
        ? ("id" in user
            ? String(user.id ?? "")
            : String(user._id ?? ""))
        : "";

    const {
        data: projects,
        isLoading: isProjectsLoading,
        isError: isProjectsError,
    } = useGetProjects();

    const {
        data: teams,
        isLoading: isTeamsLoading,
    } = useGetTeams();

    // Open the create modal when navigation state requests it.
    useEffect(() => {
        if (location.state?.openCreateProject && isAdmin) {
            setIsCreateModalOpen(true);

            navigate(location.pathname, {
                replace: true,
                state: {},
            });
        }
    }, [
        location.state,
        location.pathname,
        navigate,
        isAdmin,
    ]);

    const handleProjectAccess = useCallback(
        (projectId: string, hasAccess: boolean) => {
            setAccessibleProjectIds((previous) => {
                if (previous[projectId] === hasAccess) {
                    return previous;
                }

                return {
                    ...previous,
                    [projectId]: hasAccess,
                };
            });
        },
        []
    );

    const projectList: Project[] = projects ?? [];
    const teamList = teams ?? [];

    // Admin sees all returned projects.
    // Members see only projects where they have active membership.
    const visibleProjects = isAdmin
        ? projectList
        : projectList.filter(
            (project) => accessibleProjectIds[project.id] === true
        );

    const isCheckingMemberProjects =
        !isAdmin &&
        Boolean(currentUserId) &&
        projectList.some(
            (project) =>
                accessibleProjectIds[project.id] === undefined
        );

    // --------------------------------------------------
    // Loading and error states
    // --------------------------------------------------

    if (isProjectsLoading || isTeamsLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="mt-4 text-sm text-gray-500">
                        Loading projects...
                    </p>
                </div>
            </div>
        );
    }

    if (isProjectsError) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                    <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                        Unable to load projects
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Styles
    // --------------------------------------------------

    const statusStyles: Record<ProjectStatus, string> = {
        PLANNING: "bg-blue-50 text-blue-700",
        ACTIVE: "bg-green-50 text-green-700",
        ON_HOLD: "bg-amber-50 text-amber-700",
        COMPLETED: "bg-purple-50 text-purple-700",
        ARCHIVED: "bg-gray-100 text-gray-600",
    };

    const priorityStyles: Record<ProjectPriority, string> = {
        LOW: "bg-gray-100 text-gray-600",
        MEDIUM: "bg-blue-50 text-blue-700",
        HIGH: "bg-orange-50 text-orange-700",
        CRITICAL: "bg-red-50 text-red-700",
    };

    const formatDate = (date?: string | null) => {
        if (!date) return "Not set";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not set";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getTeamName = (teamId: string) => {
        const team = teamList.find(
            (item) =>
                String(item.id ?? item.id) === String(teamId)
        );

        return team?.name ?? "Team";
    };

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">

            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Projects
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        {isAdmin
                            ? "Manage and track all projects."
                            : "View and manage your assigned projects."}
                    </p>
                </div>

                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create Project
                    </button>
                )}
            </div>

            {/* Membership checks for members */}
            {!isAdmin && currentUserId && (
                <div className="hidden">
                    {projectList.map((project) => (
                        <ProjectAccessCheck
                            key={project.id}
                            project={project}
                            currentUserId={currentUserId}
                            onAccess={handleProjectAccess}
                        />
                    ))}
                </div>
            )}

            {/* Project count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {visibleProjects.length}{" "}
                    {visibleProjects.length === 1
                        ? "project"
                        : "projects"}
                </p>
            </div>

            {/* Empty / checking state */}
            {visibleProjects.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                    {isCheckingMemberProjects ? (
                        <>
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                Checking your projects...
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Please wait while we check your project memberships.
                            </p>
                        </>
                    ) : (
                        <>
                            <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />

                            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                                No projects found
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {isAdmin
                                    ? "Create a project to get started."
                                    : "You don't have any active project memberships yet."}
                            </p>

                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    <Plus size={18} />
                                    Create Project
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Projects grid */}
            {visibleProjects.length > 0 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleProjects.map((project) => (
                        <button
                            key={project.id}
                            type="button"
                            onClick={() =>
                                navigate(`/projects/${project.id}`)
                            }
                            className="group rounded-xl border border-gray-200 bg-white p-5 text-left transition hover:border-blue-300 hover:shadow-md"
                        >
                            {/* Project title and key */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <FolderKanban size={22} />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="truncate font-semibold text-gray-900 group-hover:text-blue-600">
                                            {project.name}
                                        </h2>

                                        <p className="mt-1 text-xs font-medium text-gray-500">
                                            {project.key}
                                        </p>
                                    </div>
                                </div>

                                <ArrowUpRight
                                    size={18}
                                    className="shrink-0 text-gray-400 transition group-hover:text-blue-600"
                                />
                            </div>

                            {/* Description */}
                            <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                                {project.description ||
                                    "No description provided."}
                            </p>

                            {/* Status and priority */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        statusStyles[project.status]
                                    }`}
                                >
                                    {project.status.replaceAll("_", " ")}
                                </span>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        priorityStyles[project.priority]
                                    }`}
                                >
                                    {project.priority}
                                </span>
                            </div>

                            {/* Team */}
                            <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                                <Users size={16} className="shrink-0" />

                                <span className="truncate">
                                    {getTeamName(project.teamId)}
                                </span>
                            </div>

                            {/* Dates */}
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays
                                    size={16}
                                    className="shrink-0"
                                />

                                <span>
                                    {formatDate(project.startDate)}
                                    {" — "}
                                    {formatDate(project.endDate)}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Create project modal */}
            {isAdmin && (
                <CreateProjectModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectsPage;
