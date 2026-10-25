
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FolderKanban,
    LoaderCircle,
    LockKeyhole,
    Save,
} from "lucide-react";

import {
    useGetProjectById,
    useUpdateProject,
} from "../../hooks/Project/ProjectHook";

import { useGetTeams } from "../../hooks/Team/TeamHook";

import type {
    ProjectPriority,
    ProjectStatus,
} from "../../types/projectTypes";
import axios from "axios";

const priorityOptions: ProjectPriority[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];

const statusLabels: Record<ProjectStatus, string> = {
    PLANNING: "Planning",
    ACTIVE: "Active",
    ON_HOLD: "On Hold",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
};

const priorityLabels: Record<ProjectPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    CRITICAL: "Critical",
};

const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

const labelClass =
    "block text-sm font-medium text-gray-700";

const EditProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const {
        data: project,
        isLoading: isProjectLoading,
        isError: isProjectError,
        error: projectError,
    } = useGetProjectById(projectId ?? "");

    const {
        data: teams,
        isLoading: isTeamsLoading,
        isError: isTeamsError,
    } = useGetTeams();

    const updateProjectMutation = useUpdateProject();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] =
        useState<ProjectPriority>("MEDIUM");
    const [status, setStatus] =
        useState<ProjectStatus>("PLANNING");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [teamId, setTeamId] = useState("");

    const [formError, setFormError] = useState("");

    // Fill the form when the project is loaded.
    useEffect(() => {
        if (!project) return;

        setName(project.name);
        setDescription(project.description ?? "");
        setPriority(project.priority);
        setStatus(project.status);
        setStartDate(project.startDate?.slice(0, 10) ?? "");
        setEndDate(project.endDate?.slice(0, 10) ?? "");
        setTeamId(project.teamId);
        setFormError("");
    }, [project]);

    // Only projects in PLANNING can be edited.
    const isProjectEditable = project?.status === "PLANNING";

    // Detect whether the user changed any form field.
    const hasChanges = useMemo(() => {
        if (!project) return false;

        return (
            name !== project.name ||
            description !== (project.description ?? "") ||
            priority !== project.priority ||
            status !== project.status ||
            startDate !== (project.startDate?.slice(0, 10) ?? "") ||
            endDate !== (project.endDate?.slice(0, 10) ?? "") ||
            teamId !== project.teamId
        );
    }, [
        project,
        name,
        description,
        priority,
        status,
        startDate,
        endDate,
        teamId,
    ]);

    const isSaving = updateProjectMutation.isPending;

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setFormError("");

        if (!projectId || !project) {
            setFormError("Project information is unavailable.");
            return;
        }

        // Prevent editing if the project is no longer in PLANNING.
        if (project.status !== "PLANNING") {
            setFormError(
                "This project can only be edited while its status is Planning."
            );
            return;
        }

        if (!hasChanges) {
            setFormError("No changes have been made.");
            return;
        }

        if (!name.trim()) {
            setFormError("Project name is required.");
            return;
        }

        if (!startDate) {
            setFormError("Start date is required.");
            return;
        }

        if (endDate && endDate < startDate) {
            setFormError(
                "End date cannot be earlier than the start date."
            );
            return;
        }

        if (!teamId) {
            setFormError("Please select a team.");
            return;
        }

        try {
            await updateProjectMutation.mutateAsync({
                projectId,
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    priority,
                    status,
                    startDate,
                    endDate: endDate || null,
                    teamId,
                },
            });

            navigate(`/projects/${projectId}`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setFormError(
                    error.response?.data?.message ??
                    "Unable to update the project. Please try again."
                );
            } else {
                setFormError(
                    "Unable to update the project. Please try again."
                );
            }
        }
    };

    if (isProjectLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <span>Loading project...</span>
                </div>
            </div>
        );
    }

    if (isProjectError || !project) {
        return (
            <div className="mx-auto max-w-3xl p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
                        <div>
                            <h2 className="font-semibold text-red-800">
                                Unable to load project
                            </h2>
                            <p className="mt-1 text-sm text-red-700">
                                {projectError instanceof Error
                                    ? projectError.message
                                    : "The project could not be found or loaded."}
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/projects")}
                                className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                            >
                                Back to Projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isFormDisabled =
        !isProjectEditable || isSaving;

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/projects/${projectId}`)}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Project
                </button>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-100 p-3">
                                <FolderKanban className="h-6 w-6 text-indigo-600" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Edit Project
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update the project configuration.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                            {project.key}
                        </span>

                        <span
                            className={`rounded-lg px-3 py-2 text-sm font-semibold ${project.status === "PLANNING"
                                    ? "bg-blue-100 text-blue-700"
                                    : project.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : project.status === "ON_HOLD"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {statusLabels[project.status]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Read-only notice */}
            {!isProjectEditable && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                        <div>
                            <h2 className="font-semibold text-amber-900">
                                Project editing is locked
                            </h2>

                            <p className="mt-1 text-sm text-amber-800">
                                This project is currently{" "}
                                <strong>
                                    {statusLabels[project.status]}
                                </strong>
                                . Project details and team assignment can
                                only be edited while the project is in
                                Planning.
                            </p>

                            <p className="mt-1 text-sm text-amber-800">
                                Scrum activities such as task assignment
                                and sprint management are handled separately.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                    <h2 className="font-semibold text-gray-900">
                        Project Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Fields marked with * are required.
                    </p>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                    {/* Project Name */}
                    <div>
                        <label htmlFor="projectName" className={labelClass}>
                            Project Name *
                        </label>

                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            disabled={isFormDisabled}
                            required
                            maxLength={100}
                            placeholder="Enter project name"
                            className={inputClass}
                        />
                    </div>

                    {/* Project Key */}
                    <div>
                        <label htmlFor="projectKey" className={labelClass}>
                            Project Key
                        </label>

                        <input
                            id="projectKey"
                            type="text"
                            value={project.key}
                            disabled
                            className={inputClass}
                        />

                        <p className="mt-1.5 text-xs text-gray-500">
                            The project key cannot be changed after creation.
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="projectDescription"
                            className={labelClass}
                        >
                            Description
                        </label>

                        <textarea
                            id="projectDescription"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            disabled={isFormDisabled}
                            rows={4}
                            maxLength={2000}
                            placeholder="Describe the purpose of this project"
                            className={inputClass}
                        />
                    </div>

                    {/* Priority and Status */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="projectPriority"
                                className={labelClass}
                            >
                                Priority *
                            </label>

                            <select
                                id="projectPriority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(
                                        event.target.value as ProjectPriority
                                    )
                                }
                                disabled={isFormDisabled}
                                className={inputClass}
                            >
                                {priorityOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {priorityLabels[option]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="projectStatus"
                                className={labelClass}
                            >
                                Project Status
                            </label>

                            <select
                                id="projectStatus"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as ProjectStatus
                                    )
                                }
                                disabled={isFormDisabled}
                                className={inputClass}
                            >
                                <option value="PLANNING">
                                    Planning
                                </option>
                                <option value="ACTIVE">
                                    Active
                                </option>
                            </select>

                            <p className="mt-1.5 text-xs text-gray-500">
                                Status changes are available only during
                                Planning.
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="startDate"
                                className={labelClass}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    Start Date *
                                </span>
                            </label>

                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(event.target.value)
                                }
                                disabled={isFormDisabled}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="endDate"
                                className={labelClass}
                            >
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    End Date
                                </span>
                            </label>

                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(event) =>
                                    setEndDate(event.target.value)
                                }
                                disabled={isFormDisabled}
                                min={startDate || undefined}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Team */}
                    <div>
                        <label
                            htmlFor="projectTeam"
                            className={labelClass}
                        >
                            Assigned Team *
                        </label>

                        <select
                            id="projectTeam"
                            value={teamId}
                            onChange={(event) =>
                                setTeamId(event.target.value)
                            }
                            disabled={
                                isFormDisabled ||
                                isTeamsLoading ||
                                isTeamsError
                            }
                            required
                            className={inputClass}
                        >
                            <option value="">
                                {isTeamsLoading
                                    ? "Loading teams..."
                                    : "Select a team"}
                            </option>

                            {(teams ?? []).map((team) => (
                                <option
                                    key={team.id}
                                    value={team.id}
                                >
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        {isTeamsError && isProjectEditable && (
                            <p className="mt-2 text-sm text-red-600">
                                Unable to load teams. Please try again later.
                            </p>
                        )}

                        <p className="mt-1.5 text-xs text-gray-500">
                            A team can be assigned to only one unfinished
                            project. Team availability is checked when you
                            save your changes.
                        </p>
                    </div>

                    {/* Error */}
                    {formError && (
                        <div
                            role="alert"
                            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{formError}</p>
                        </div>
                    )}

                    {updateProjectMutation.isSuccess && (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Project updated successfully.
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/projects/${projectId}`)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    {isProjectEditable && (
                        <button
                            type="submit"
                            disabled={
                                !hasChanges ||
                                isSaving ||
                                isTeamsLoading ||
                                isTeamsError
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {isSaving ? (
                                <>
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditProjectPage;
