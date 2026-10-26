import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createProjectSchema, type CreateProjectFormData } from "../../../lib/validations/project.schema";
import { useCreateProject } from "../../../hooks/Project/ProjectHook";
import { useGetTeams, useGetTeamMembers } from "../../../hooks/Team/TeamHook";
import { useGetUsers } from "../../../hooks/User/UserHooks";

// import { useCreateProject } from "../../hooks/Project/ProjectHook";
// import { useGetTeams } from "../../hooks/Team/TeamHook";
// import { useGetUsers } from "../../hooks/User/UserHook";

// import {
//     createProjectSchema,
//     type CreateProjectFormData,
// } from "../../validation/project.schema";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormData: CreateProjectFormData = {
    name: "",
    key: "",
    description: "",
    priority: "MEDIUM",
    startDate: "",
    endDate: "",
    teamId: "",
    productOwnerId: "",
    scrumMasterId: "",
    additionalMemberIds: [],
};

const CreateProjectModal = ({
    isOpen,
    onClose,
}: CreateProjectModalProps) => {
    const createProjectMutation = useCreateProject();

    const [formData, setFormData] =
        useState<CreateProjectFormData>(initialFormData);

    const [errors, setErrors] = useState<
        Partial<Record<keyof CreateProjectFormData, string>>
    >({});

    const [showAllMembers, setShowAllMembers] = useState(false);



    const {
        data: teams,
        isLoading: isTeamsLoading,
        isError: isTeamsError,
    } = useGetTeams();

    const {
        data: usersResponse,
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useGetUsers({
        page: 1,
        limit: 100,
    });

    const {
        data: selectedTeamMembers,
        isLoading: isTeamMembersLoading,
    } = useGetTeamMembers(formData.teamId);



    const users = usersResponse?.data ?? [];

    // Only active, verified members can be assigned project roles.
    const eligibleUsers = users.filter(
        (user) =>
            user.role === "MEMBER" &&
            user.isActive &&
            user.isEmailVerified
    );

    const updateField = <K extends keyof CreateProjectFormData>(
        field: K,
        value: CreateProjectFormData[K]
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormData);
            setErrors({});
            setShowAllMembers(false);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        if (createProjectMutation.isPending) return;

        setFormData(initialFormData);
        setErrors({});
        setShowAllMembers(false);
        onClose();
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const result = createProjectSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Partial<
                Record<keyof CreateProjectFormData, string>
            > = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof CreateProjectFormData;

                if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });

            setErrors(fieldErrors);
            toast.error("Please correct the form errors");
            return;
        }

        if (isTeamsError || isUsersError) {
            toast.error("Unable to load teams or users. Please try again.");
            return;
        }

        const payload = {
            ...result.data,
            startDate: new Date(result.data.startDate).toISOString(),
            endDate: result.data.endDate
                ? new Date(result.data.endDate).toISOString()
                : null,
            additionalMemberIds: result.data.additionalMemberIds ?? [],
        };

        try {
            await createProjectMutation.mutateAsync(payload);

            toast.success("Project created successfully");
            setFormData(initialFormData);
            setErrors({});
            onClose();
        } catch (error: unknown) {
            const apiError = error as {
                response?: {
                    data?: {
                        message?: string;
                        error?: string;
                    };
                };
            };

            toast.error(
                apiError.response?.data?.message ||
                apiError.response?.data?.error ||
                "Failed to create project"
            );
        }
    };

    const selectedTeamMemberIds = new Set(
        (selectedTeamMembers ?? []).map((member) =>
            String(member.userId)
        )
    );

    const availableAdditionalMembers = eligibleUsers.filter(
        (user) =>
            !selectedTeamMemberIds.has(String(user._id)) &&
            user._id !== formData.productOwnerId &&
            user._id !== formData.scrumMasterId
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create Project
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Set up a project and assign its team and Scrum roles.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={createProjectMutation.isPending}
                        aria-label="Close modal"
                        className="text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Project name and key */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(event) =>
                                    updateField("name", event.target.value)
                                }
                                placeholder="Food Delivery App"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Project Key *
                            </label>
                            <input
                                type="text"
                                value={formData.key}
                                onChange={(event) =>
                                    updateField(
                                        "key",
                                        event.target.value.toUpperCase()
                                    )
                                }
                                placeholder="FOOD"
                                maxLength={10}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-black"
                            />
                            {errors.key && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.key}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            placeholder="Describe the purpose of this project..."
                            rows={3}
                            maxLength={500}
                            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Priority and dates */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Priority *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(event) =>
                                    updateField(
                                        "priority",
                                        event.target.value as CreateProjectFormData["priority"]
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(event) =>
                                    updateField("startDate", event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.startDate}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                min={formData.startDate || undefined}
                                value={formData.endDate ?? ""}
                                onChange={(event) =>
                                    updateField("endDate", event.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Team */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Project Team *
                        </label>

                        {isTeamsError ? (
                            <p className="text-sm text-red-600">
                                Failed to load teams.
                            </p>
                        ) : (
                            <select
                                value={formData.teamId}
                                onChange={(event) =>
                                    updateField("teamId", event.target.value)
                                }
                                disabled={isTeamsLoading}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isTeamsLoading
                                        ? "Loading teams..."
                                        : "Select a team"}
                                </option>
                                {teams?.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {errors.teamId && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.teamId}
                            </p>
                        )}
                    </div>

                    {/* Product Owner and Scrum Master */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Product Owner *
                            </label>
                            <select
                                value={formData.productOwnerId}
                                onChange={(event) =>
                                    updateField("productOwnerId", event.target.value)
                                }
                                disabled={isUsersLoading || isUsersError}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isUsersLoading
                                        ? "Loading users..."
                                        : "Select Product Owner"}
                                </option>
                                {eligibleUsers.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.productOwnerId && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.productOwnerId}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Scrum Master *
                            </label>
                            <select
                                value={formData.scrumMasterId}
                                onChange={(event) =>
                                    updateField("scrumMasterId", event.target.value)
                                }
                                disabled={isUsersLoading || isUsersError}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isUsersLoading
                                        ? "Loading users..."
                                        : "Select Scrum Master"}
                                </option>
                                {eligibleUsers
                                    .filter(
                                        (user) =>
                                            user._id !== formData.productOwnerId
                                    )
                                    .map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstName} {user.lastName} ({user.email})
                                        </option>
                                    ))}
                            </select>
                            {errors.scrumMasterId && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.scrumMasterId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Optional additional members */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowAllMembers((previous) => !previous)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            {showAllMembers ? "Hide" : "Add"} additional project members (optional)
                        </button>

                        {showAllMembers && (
                            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                                {!formData.teamId ? (
                                    <p className="text-sm text-gray-500">
                                        Please select a team first.
                                    </p>
                                ) : isTeamMembersLoading ? (
                                    <p className="text-sm text-gray-500">
                                        Loading team members...
                                    </p>
                                ) : availableAdditionalMembers.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No additional members available.
                                    </p>
                                ) : (
                                    availableAdditionalMembers.map((user) => {
                                        const selected =
                                            formData.additionalMemberIds?.includes(user._id) ?? false;

                                        return (
                                            <label
                                                key={user._id}
                                                className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selected}
                                                    onChange={(event) => {
                                                        const current =
                                                            formData.additionalMemberIds ?? [];

                                                        const next = event.target.checked
                                                            ? [...current, user._id]
                                                            : current.filter(
                                                                (id) => id !== user._id
                                                            );

                                                        updateField("additionalMemberIds", next);
                                                    }}
                                                    className="rounded border-gray-300"
                                                />

                                                {user.firstName} {user.lastName} ({user.email})
                                            </label>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={createProjectMutation.isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                createProjectMutation.isPending ||
                                isTeamsLoading ||
                                isTeamsError ||
                                isUsersLoading ||
                                isUsersError
                            }
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createProjectMutation.isPending
                                ? "Creating..."
                                : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;