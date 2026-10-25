
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    FolderKanban,
    Users,
    Plus,
    X,
    UserRound,
    Pencil,
    Trash2,
    AlertTriangle,
    Archive,
} from "lucide-react";
import axios from "axios";

import {
    useGetProjectById,
    useArchiveProject,
} from "../../hooks/Project/ProjectHook";

import {
    useGetProjectMembers,
    useGetAvailableProjectMembers,
    useAddProjectMember,
    useUpdateProjectMemberRole,
    useRemoveProjectMember,
} from "../../hooks/Project/ProjectMemberHook";

import type {
    ProjectPriority,
    ProjectStatus,
} from "../../types/projectTypes";

import type {
    ProjectScrumRole,
} from "../../services/Project/projectMemberService";

const statusStyles: Record<ProjectStatus, string> = {
    PLANNING: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",
    ON_HOLD: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
};

const priorityStyles: Record<ProjectPriority, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
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

const formatScrumRole = (role: ProjectScrumRole) => {
    switch (role) {
        case "PRODUCT_OWNER":
            return "Product Owner";
        case "SCRUM_MASTER":
            return "Scrum Master";
        case "DEVELOPER":
            return "Developer";
        default:
            return role;
    }
};

const ProjectDetailsPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();

    const currentUser = useSelector(
        (state: RootState) => state.auth.user
    );

    // Add member modal
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedScrumRole, setSelectedScrumRole] =
        useState<ProjectScrumRole>("DEVELOPER");

    // Edit role modal
    const [selectedEditMember, setSelectedEditMember] = useState<{
        userId: string;
        firstName: string;
        lastName: string;
        scrumRole: ProjectScrumRole;
    } | null>(null);

    const [editScrumRole, setEditScrumRole] =
        useState<ProjectScrumRole>("DEVELOPER");

    // Archive project modal
    const archiveProjectMutation = useArchiveProject();
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [archiveError, setArchiveError] = useState("");

    // Remove member confirmation modal
    const [selectedRemoveMember, setSelectedRemoveMember] = useState<{
        userId: string;
        firstName: string;
        lastName: string;
    } | null>(null);

    // Project query
    const {
        data: project,
        isLoading,
        isError,
        refetch,
    } = useGetProjectById(projectId ?? "");

    // Project members query
    const {
        data: projectMembersData,
        isLoading: isMembersLoading,
        isError: isMembersError,
        refetch: refetchProjectMembers,
    } = useGetProjectMembers(projectId ?? "");

    const isAdmin = currentUser?.role === "ADMIN";

    // Available members are only needed by administrators.
    const {
        data: availableMembers,
        isLoading: isAvailableMembersLoading,
        isError: isAvailableMembersError,
        refetch: refetchAvailableMembers,
    } = useGetAvailableProjectMembers(projectId ?? "", isAdmin);

    // Member mutations
    const addProjectMemberMutation = useAddProjectMember(
        projectId ?? ""
    );

    const updateProjectMemberRoleMutation =
        useUpdateProjectMemberRole(projectId ?? "");

    const removeProjectMemberMutation =
        useRemoveProjectMember(projectId ?? "");

    const projectMembers = projectMembersData?.members ?? [];

    const currentUserId = currentUser
        ? ("id" in currentUser
            ? String(currentUser.id)
            : String(currentUser._id ?? ""))
        : "";

    const currentProjectMember = projectMembers.find(
        (member) =>
            String(member.userId) === currentUserId &&
            member.status === "ACTIVE"
    );

    const currentScrumRole = currentProjectMember?.scrumRole;

    const isProductOwner = currentScrumRole === "PRODUCT_OWNER";
    const isScrumMaster = currentScrumRole === "SCRUM_MASTER";
    const isDeveloper = currentScrumRole === "DEVELOPER";

    // Project administration permissions
    const canEditProject = isAdmin;
    const canArchiveProject = isAdmin;
    const canManageMembers = isAdmin;

    // Backlog access is available to all project roles.
    // Only the Product Owner can manage backlog items.
    const canViewBacklog = isAdmin || Boolean(currentScrumRole);
    const canManageEpics = isProductOwner;
    const canManageStories = isProductOwner;

    // These modules are not linked until their frontend routes/pages exist.
    // Do not display links to unimplemented modules.
    const hasSprintModule = false;
    const hasTaskModule = false;

    const canShowSprintNavigation =
        hasSprintModule && (isScrumMaster || isProductOwner);

    const canShowTaskNavigation =
        hasTaskModule && isDeveloper;

    // Check whether these Scrum roles are already assigned.
    const hasProductOwner = projectMembers.some(
        (member) =>
            member.scrumRole === "PRODUCT_OWNER" &&
            member.status === "ACTIVE"
    );

    const hasScrumMaster = projectMembers.some(
        (member) =>
            member.scrumRole === "SCRUM_MASTER" &&
            member.status === "ACTIVE"
    );

    // Add member
    const handleAddMember = async () => {
        if (!projectId || !selectedUserId || !isAdmin) return;

        try {
            await addProjectMemberMutation.mutateAsync({
                userId: selectedUserId,
                scrumRole: selectedScrumRole,
            });

            setSelectedUserId("");
            setSelectedScrumRole("DEVELOPER");
            setIsAddMemberOpen(false);
        } catch {
            // The mutation error is displayed inside the modal.
        }
    };

    const closeAddMemberModal = () => {
        if (addProjectMemberMutation.isPending) return;

        setIsAddMemberOpen(false);
        setSelectedUserId("");
        setSelectedScrumRole("DEVELOPER");
    };

    // Open edit role modal
    const openEditRoleModal = (member: {
        userId: string;
        firstName: string;
        lastName: string;
        scrumRole: ProjectScrumRole;
    }) => {
        if (!isAdmin) return;

        setSelectedEditMember(member);
        setEditScrumRole(member.scrumRole);
    };

    // Update member Scrum role
    const handleUpdateScrumRole = async () => {
        if (!projectId || !selectedEditMember || !isAdmin) return;

        try {
            await updateProjectMemberRoleMutation.mutateAsync({
                userId: selectedEditMember.userId,
                payload: {
                    scrumRole: editScrumRole,
                },
            });

            setSelectedEditMember(null);
        } catch {
            // The mutation error is displayed inside the edit modal.
        }
    };

    const closeEditRoleModal = () => {
        if (updateProjectMemberRoleMutation.isPending) return;

        setSelectedEditMember(null);
    };

    // Archive project
    const handleArchiveProject = async () => {
        if (
            !isAdmin ||
            !project ||
            project.status !== "PLANNING" ||
            !projectId
        ) {
            return;
        }

        setArchiveError("");

        try {
            await archiveProjectMutation.mutateAsync(projectId);

            setIsArchiveModalOpen(false);
            navigate("/projects");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setArchiveError(
                    error.response?.data?.message ??
                    "Unable to archive the project. Please try again."
                );
            } else {
                setArchiveError(
                    "Unable to archive the project. Please try again."
                );
            }
        }
    };

    const closeArchiveModal = () => {
        if (archiveProjectMutation.isPending) return;

        setIsArchiveModalOpen(false);
        setArchiveError("");
    };

    // Remove member
    const handleRemoveMember = async () => {
        if (!isAdmin || !projectId || !selectedRemoveMember) return;

        try {
            await removeProjectMemberMutation.mutateAsync(
                selectedRemoveMember.userId
            );

            setSelectedRemoveMember(null);
        } catch {
            // The mutation error is displayed inside the confirmation modal.
        }
    };

    const closeRemoveMemberModal = () => {
        if (removeProjectMemberMutation.isPending) return;

        setSelectedRemoveMember(null);
    };

    if (!projectId) {
        return (
            <div className="p-6">
                <p className="text-red-600">
                    Project ID is missing from the URL.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="mt-4 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                >
                    Back to Projects
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading project details...
                </p>
            </div>
        );
    }

    if (isError || !project) {
        return (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="font-medium text-red-700">
                    Failed to load project details.
                </p>

                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        Try again
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const isProjectArchived = project.status === "ARCHIVED";
    const canEditProjectNow =
        canEditProject &&
        project.status === "PLANNING";

    const canArchiveProjectNow =
        canArchiveProject &&
        project.status === "PLANNING";

    const canManageMembersNow =
        canManageMembers &&
        !isProjectArchived;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Back navigation */}
            <button
                type="button"
                onClick={() => navigate("/projects")}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={17} />
                Back to Projects
            </button>

            {/* Project navigation */}
            <nav
                aria-label="Project navigation"
                className="flex flex-wrap gap-2 border-b border-gray-200 pb-3"
            >
                <button
                    type="button"
                    className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
                    aria-current="page"
                >
                    Overview
                </button>

                {canViewBacklog && (
                    <Link
                        to={`/projects/${projectId}/backlog`}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        Product Backlog
                    </Link>
                )}

                {canShowSprintNavigation && (
                    <Link
                        to={`/projects/${projectId}/sprints`}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        Sprints
                    </Link>
                )}

                {canShowTaskNavigation && (
                    <Link
                        to={`/projects/${projectId}/tasks`}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        Tasks
                    </Link>
                )}

                {!isAdmin &&
                    !isMembersLoading &&
                    !isMembersError &&
                    !currentScrumRole && (
                        <p className="w-full text-sm text-amber-700">
                            Your Scrum role for this project could not be
                            determined. Please check your project membership.
                        </p>
                    )}
            </nav>

            {/* Project heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3">
                    <div
                        className={`rounded-xl p-3 ${isProjectArchived
                                ? "bg-gray-100"
                                : "bg-indigo-50"
                            }`}
                    >
                        <FolderKanban
                            size={26}
                            className={
                                isProjectArchived
                                    ? "text-gray-500"
                                    : "text-indigo-600"
                            }
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            {project.key}
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900">
                            {project.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                            {project.description ||
                                "No description provided."}
                        </p>

                        {/* Project actions: Admin only */}
                        {isAdmin && project.status === "PLANNING" && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/projects/${projectId}/edit`)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                                >
                                    <Pencil size={16} />
                                    Edit Project
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setArchiveError("");
                                        setIsArchiveModalOpen(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
                                >
                                    <Archive size={16} />
                                    Archive Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusStyles[project.status]}`}
                    >
                        {project.status.replace("_", " ")}
                    </span>

                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${priorityStyles[project.priority]}`}
                    >
                        {project.priority} priority
                    </span>
                </div>
            </div>

            {/* Archived project notice */}
            {isProjectArchived && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                        <Archive
                            size={20}
                            className="mt-0.5 shrink-0 text-gray-500"
                        />

                        <div>
                            <h2 className="font-medium text-gray-800">
                                This project is archived
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This project is preserved for reference.
                                Project editing, archiving, and member-management
                                actions are unavailable.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Project information */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <section className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Project Overview
                    </h2>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">
                                Project Name
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {project.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Project Key
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {project.key}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Created At
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {formatDate(project.createdAt)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Last Updated
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {formatDate(project.updatedAt)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="rounded-xl border border-gray-200 bg-white p-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Timeline
                    </h2>

                    <div className="mt-5 space-y-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-indigo-50 p-2">
                                <CalendarDays
                                    size={18}
                                    className="text-indigo-600"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Start Date
                                </p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {formatDate(project.startDate)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <CalendarDays
                                    size={18}
                                    className="text-gray-600"
                                />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    End Date
                                </p>
                                <p className="mt-1 font-medium text-gray-900">
                                    {formatDate(project.endDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Project team and members */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-50 p-2.5">
                            <Users
                                size={22}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Project Team and Members
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {projectMembers.length}{" "}
                                {projectMembers.length === 1
                                    ? "member"
                                    : "members"}{" "}
                                assigned to this project.
                            </p>
                        </div>
                    </div>

                    {isAdmin && project.status !== "ARCHIVED" && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsAddMemberOpen(true);
                                void refetchAvailableMembers();
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <Plus size={17} />
                            Add Member
                        </button>
                    )}
                </div>

                <div className="mt-5">
                    {isMembersLoading ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Loading project members...
                        </p>
                    ) : isMembersError ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-red-600">
                                Failed to load project members.
                            </p>

                            <button
                                type="button"
                                onClick={() => refetchProjectMembers()}
                                className="mt-3 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Try again
                            </button>
                        </div>
                    ) : projectMembers.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center">
                            <Users
                                size={30}
                                className="mx-auto text-gray-400"
                            />

                            <p className="mt-3 font-medium text-gray-700">
                                No project members found
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Members of the assigned team should appear here
                                automatically.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {projectMembers.map((member) => {
                                const canEditMember =
                                    isAdmin &&
                                    project.status !== "ARCHIVED" &&
                                    member.membershipSource === "INDIVIDUAL" &&
                                    member.status === "ACTIVE";

                                const canRemoveMember =
                                    canEditMember &&
                                    member.scrumRole === "DEVELOPER";
                                return (
                                    <div
                                        key={member.userId}
                                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {member.profileImage ? (
                                                <img
                                                    src={member.profileImage}
                                                    alt={`${member.firstName} ${member.lastName}`}
                                                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                    <UserRound size={21} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-gray-900">
                                                    {member.firstName}{" "}
                                                    {member.lastName}
                                                </p>

                                                <p className="truncate text-sm text-gray-500">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                                                {formatScrumRole(member.scrumRole)}
                                            </span>

                                            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                                                {member.role}
                                            </span>

                                            {canEditMember && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditRoleModal({
                                                            userId: member.userId,
                                                            firstName: member.firstName,
                                                            lastName: member.lastName,
                                                            scrumRole: member.scrumRole,
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                                                >
                                                    <Pencil size={14} />
                                                    Edit Role
                                                </button>
                                            )}

                                            {canRemoveMember && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedRemoveMember({
                                                            userId: member.userId,
                                                            firstName: member.firstName,
                                                            lastName: member.lastName,
                                                        })
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Add member modal */}
            {isAddMemberOpen && isAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={closeAddMemberModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-project-member-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="add-project-member-title"
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    Add Project Member
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select a user and assign a Scrum role.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close modal"
                                disabled={addProjectMemberMutation.isPending}
                                onClick={closeAddMemberModal}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isAvailableMembersLoading ? (
                            <p className="py-8 text-center text-sm text-gray-500">
                                Loading available members...
                            </p>
                        ) : isAvailableMembersError ? (
                            <div className="mt-5 rounded-lg bg-red-50 p-3">
                                <p className="text-sm text-red-700">
                                    Failed to load available members.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => refetchAvailableMembers()}
                                    className="mt-2 text-sm font-medium text-red-700 underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="project-member"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Select Member
                                        </label>

                                        <select
                                            id="project-member"
                                            value={selectedUserId}
                                            onChange={(event) =>
                                                setSelectedUserId(event.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="">
                                                Select a member
                                            </option>

                                            {(availableMembers ?? []).map((member) => (
                                                <option
                                                    key={member.userId}
                                                    value={member.userId}
                                                >
                                                    {member.firstName}{" "}
                                                    {member.lastName} ({member.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="project-scrum-role"
                                            className="mb-1.5 block text-sm font-medium text-gray-700"
                                        >
                                            Scrum Role
                                        </label>

                                        <select
                                            id="project-scrum-role"
                                            value={selectedScrumRole}
                                            onChange={(event) =>
                                                setSelectedScrumRole(
                                                    event.target.value as ProjectScrumRole
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="DEVELOPER">
                                                Developer
                                            </option>

                                            {!hasProductOwner && (
                                                <option value="PRODUCT_OWNER">
                                                    Product Owner
                                                </option>
                                            )}

                                            {!hasScrumMaster && (
                                                <option value="SCRUM_MASTER">
                                                    Scrum Master
                                                </option>
                                            )}
                                        </select>
                                    </div>

                                    {(availableMembers ?? []).length === 0 && (
                                        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                            No additional members are available to add.
                                        </p>
                                    )}

                                    {addProjectMemberMutation.isError && (
                                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                            Could not add this member. Please check the
                                            role assignment and try again.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        disabled={addProjectMemberMutation.isPending}
                                        onClick={closeAddMemberModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            !selectedUserId ||
                                            addProjectMemberMutation.isPending ||
                                            (availableMembers ?? []).length === 0
                                        }
                                        onClick={handleAddMember}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {addProjectMemberMutation.isPending
                                            ? "Adding..."
                                            : "Add Member"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit role modal */}
            {selectedEditMember && isAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={closeEditRoleModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-project-member-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-indigo-50 p-2">
                                        <Pencil
                                            size={18}
                                            className="text-indigo-600"
                                        />
                                    </div>

                                    <h2
                                        id="edit-project-member-title"
                                        className="text-lg font-semibold text-gray-900"
                                    >
                                        Edit Scrum Role
                                    </h2>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    Change the project role for{" "}
                                    <span className="font-medium text-gray-800">
                                        {selectedEditMember.firstName}{" "}
                                        {selectedEditMember.lastName}
                                    </span>
                                    .
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close modal"
                                disabled={updateProjectMemberRoleMutation.isPending}
                                onClick={closeEditRoleModal}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="edit-project-scrum-role"
                                className="mb-1.5 block text-sm font-medium text-gray-700"
                            >
                                Scrum Role
                            </label>

                            <select
                                id="edit-project-scrum-role"
                                value={editScrumRole}
                                onChange={(event) =>
                                    setEditScrumRole(
                                        event.target.value as ProjectScrumRole
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="DEVELOPER">Developer</option>
                                <option value="PRODUCT_OWNER">Product Owner</option>
                                <option value="SCRUM_MASTER">Scrum Master</option>
                            </select>

                            {updateProjectMemberRoleMutation.isError && (
                                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                    Could not update the Scrum role. The role may
                                    already be assigned to another member. Please try again.
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={updateProjectMemberRoleMutation.isPending}
                                onClick={closeEditRoleModal}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={
                                    editScrumRole === selectedEditMember.scrumRole ||
                                    updateProjectMemberRoleMutation.isPending
                                }
                                onClick={handleUpdateScrumRole}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {updateProjectMemberRoleMutation.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Remove member confirmation modal */}
            {selectedRemoveMember && isAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={closeRemoveMemberModal}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="remove-project-member-title"
                        aria-describedby="remove-project-member-description"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 rounded-full bg-red-100 p-3">
                                <AlertTriangle
                                    size={23}
                                    className="text-red-600"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2
                                    id="remove-project-member-title"
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    Remove Project Member?
                                </h2>

                                <p
                                    id="remove-project-member-description"
                                    className="mt-2 text-sm leading-6 text-gray-600"
                                >
                                    Are you sure you want to remove{" "}
                                    <span className="font-semibold text-gray-900">
                                        {selectedRemoveMember.firstName}{" "}
                                        {selectedRemoveMember.lastName}
                                    </span>{" "}
                                    from this project? This action will remove
                                    their active individual project membership.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close modal"
                                disabled={removeProjectMemberMutation.isPending}
                                onClick={closeRemoveMemberModal}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {removeProjectMemberMutation.isError && (
                            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                Could not remove this member. Please try again.
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={removeProjectMemberMutation.isPending}
                                onClick={closeRemoveMemberModal}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Keep Member
                            </button>

                            <button
                                type="button"
                                disabled={removeProjectMemberMutation.isPending}
                                onClick={handleRemoveMember}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                                {removeProjectMemberMutation.isPending
                                    ? "Removing..."
                                    : "Remove Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive project confirmation modal */}
            {isArchiveModalOpen && isAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={closeArchiveModal}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="archive-project-title"
                        aria-describedby="archive-project-description"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 rounded-full bg-amber-100 p-3">
                                <Archive
                                    size={23}
                                    className="text-amber-600"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2
                                    id="archive-project-title"
                                    className="text-lg font-semibold text-gray-900"
                                >
                                    Archive Project?
                                </h2>

                                <p
                                    id="archive-project-description"
                                    className="mt-2 text-sm leading-6 text-gray-600"
                                >
                                    Are you sure you want to archive{" "}
                                    <span className="font-semibold text-gray-900">
                                        {project.name}
                                    </span>
                                    ? The project will be marked as archived
                                    and will remain in the database.
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Close modal"
                                disabled={archiveProjectMutation.isPending}
                                onClick={closeArchiveModal}
                                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {archiveError && (
                            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {archiveError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={archiveProjectMutation.isPending}
                                onClick={closeArchiveModal}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={archiveProjectMutation.isPending}
                                onClick={handleArchiveProject}
                                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Archive size={16} />
                                {archiveProjectMutation.isPending
                                    ? "Archiving..."
                                    : "Archive Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsPage;
