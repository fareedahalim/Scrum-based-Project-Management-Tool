
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
    Archive,
    BookOpen,
    CircleAlert,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    X,
} from "lucide-react";

import type { RootState } from "../../store/store";

import { useGetProjectById } from "../../hooks/Project/ProjectHook";
import { useGetProjectMembers } from "../../hooks/Project/ProjectMemberHook";
import { useGetEpicsByProject } from "../../hooks/Epic/EpicHook";
import {
    useGetStoriesByProject,
    useCreateStory,
    useUpdateStory,
    useArchiveStory,
} from "../../hooks/Story/StoryHook";

import type {
    Story,
    StoryPriority,
    StoryStatus,
    AcceptanceCriterion,
    CreateStoryPayload,
    UpdateStoryPayload,
} from "../../services/Story/storyService";

const priorityClasses: Record<StoryPriority, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};


const statusClasses: Record<StoryStatus, string> = {
    DRAFT: "border border-amber-200 bg-amber-50 text-amber-800",
    READY: "border border-emerald-200 bg-emerald-50 text-emerald-800",
};


const inputClasses =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100";

const labelClasses = "mb-1.5 block text-sm font-medium text-slate-700";

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message;

        if (typeof serverMessage === "string") {
            return serverMessage;
        }

        return error.message || "Something went wrong.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
};

const createEmptyCriterion = (): AcceptanceCriterion => ({
    id: `criterion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: "",
    isCompleted: false,
});

const getInitialCriteria = (
    criteria: AcceptanceCriterion[] = [],
): AcceptanceCriterion[] =>
    criteria.length > 0
        ? criteria.map((criterion) => ({ ...criterion }))
        : [createEmptyCriterion()];

export default function StoryBacklogPage() {
    const { projectId = "" } = useParams<{ projectId: string }>();

    const [searchParams, setSearchParams] = useSearchParams();

    const epicIdFromUrl = searchParams.get("epicId") ?? "";
    const storyIdFromUrl = searchParams.get("storyId") ?? "";

    const currentUser = useSelector(
        (state: RootState) => state.auth.user,
    );

    

    const {
        data: projectData,
        isLoading: isProjectLoading,
        isError: isProjectError,
        error: projectError,
        refetch: refetchProject,
    } = useGetProjectById(projectId);

    const {
        data: projectMembersData,
        isLoading: isMembersLoading,
        isError: isMembersError,
        error: membersError,
        refetch: refetchMembers,
    } = useGetProjectMembers(projectId);

    const {
        data: epics,
        isLoading: isEpicsLoading,
        isError: isEpicsError,
        error: epicsError,
        refetch: refetchEpics,
    } = useGetEpicsByProject(projectId, false);

    const {
        data: stories,
        isLoading: isStoriesLoading,
        isError: isStoriesError,
        error: storiesError,
        refetch: refetchStories,
    } = useGetStoriesByProject(projectId, {
    includeArchived: true,
    page: 1,
    limit: 100,
});

    const createStoryMutation = useCreateStory(projectId);
    const updateStoryMutation = useUpdateStory(projectId);
    const archiveStoryMutation = useArchiveStory(projectId);

   const [search, setSearch] = useState("");
const [includeArchived, setIncludeArchived] = useState(false);

const [statusFilter, setStatusFilter] = useState<
    "ALL" | StoryStatus
>("ALL");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    const [storyToArchive, setStoryToArchive] = useState<Story | null>(null);

    const [selectedEpicId, setSelectedEpicId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<StoryPriority>("MEDIUM");
    const [storyPoints, setStoryPoints] = useState<string>("3");
    const [status, setStatus] = useState<StoryStatus>("DRAFT");
    const [criteria, setCriteria] = useState<AcceptanceCriterion[]>([
        createEmptyCriterion(),
    ]);
    const [labelsInput, setLabelsInput] = useState("");

    const [formError, setFormError] = useState("");
    const [archiveError, setArchiveError] = useState("");
    const [pageMessage, setPageMessage] = useState("");

    const members = projectMembersData?.members ?? [];
    const epicList = epics ?? [];
const allStories = stories?.stories ?? [];
const pagination = stories?.pagination;
    const selectedStory = storyIdFromUrl
        ? allStories.find(
              (story) => story._id === storyIdFromUrl,
          )
        : undefined;

    const currentUserId = currentUser
        ? "id" in currentUser
            ? String(currentUser.id)
            : String(currentUser._id ?? "")
        : "";

    const currentMembership = members.find(
        (member) =>
            String(member.userId) === currentUserId &&
            member.status === "ACTIVE",
    );

    const isProductOwner =
        currentMembership?.scrumRole === "PRODUCT_OWNER";

    const isAdmin = currentUser?.role === "ADMIN";

    // Only the Product Owner assigned to this project can manage stories.
    // The backend must enforce these permissions as well.
    const canManageStories = isProductOwner;

    const activeStories = allStories.filter(
        (story) => !story.isArchived,
    );

    const archivedStories = allStories.filter(
        (story) => story.isArchived,
    );

    // When a storyId is present, display only that story.
    // Otherwise, apply the regular epic, archive, and search filters.
   const visibleStories = allStories.filter((story) => {
    // If a specific story is selected, show only that story.
    if (storyIdFromUrl) {
        return story._id === storyIdFromUrl;
    }

    const storyEpicId = String(story.epicId);

    // Filter by epic.
    if (epicIdFromUrl && storyEpicId !== epicIdFromUrl) {
        return false;
    }

    // Hide archived stories unless the user enables them.
    if (!includeArchived && story.isArchived) {
        return false;
    }

    // Filter by story status: ALL, DRAFT, or READY.
    if (statusFilter !== "ALL" && story.status !== statusFilter) {
        return false;
    }

    // Search by title, key, description, epic ID, or label.
    const query = search.trim().toLowerCase();

    if (!query) {
        return true;
    }

    return (
        story.title.toLowerCase().includes(query) ||
        story.key.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        storyEpicId.toLowerCase().includes(query) ||
        story.labels.some((label) =>
            label.toLowerCase().includes(query),
        )
    );
});

    const readyStories = activeStories.filter(
        (story) => story.status === "READY",
    );

    const draftStories = activeStories.filter(
        (story) => story.status === "DRAFT",
    );

    const totalStoryPoints = activeStories.reduce(
        (total, story) => total + (story.storyPoints ?? 0),
        0,
    );

    const isSaving =
        createStoryMutation.isPending ||
        updateStoryMutation.isPending;

    const retryLoading = async () => {
        await Promise.all([
            refetchProject(),
            refetchMembers(),
            refetchEpics(),
            refetchStories(),
        ]);
    };

    const resetForm = () => {
        setSelectedEpicId("");
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setStoryPoints("3");
        setStatus("DRAFT");
        setCriteria([createEmptyCriterion()]);
        setLabelsInput("");
        setFormError("");
        setEditingStory(null);
    };

    const openCreateForm = () => {
        resetForm();

        const epicExists = epicList.some(
            (epic) => String(epic._id) === epicIdFromUrl,
        );

        setSelectedEpicId(
            epicIdFromUrl && epicExists
                ? epicIdFromUrl
                : String(epicList[0]?._id ?? ""),
        );

        setPageMessage("");
        setIsFormOpen(true);
    };

    const openEditForm = (story: Story) => {
        resetForm();

        setEditingStory(story);
        setSelectedEpicId(String(story.epicId));
        setTitle(story.title);
        setDescription(story.description);
        setPriority(story.priority);
        setStoryPoints(
            story.storyPoints === null
                ? ""
                : String(story.storyPoints),
        );
        setStatus(story.status);
        setCriteria(getInitialCriteria(story.acceptanceCriteria));
        setLabelsInput(story.labels.join(", "));

        setPageMessage("");
        setIsFormOpen(true);
    };

    // Automatically open the Edit Story modal when this page is opened
    // with a storyId query parameter.
    //
    // The ref prevents the modal from reopening when the user closes it.
    const autoOpenedStoryId = useRef<string | null>(null);

    useEffect(() => {
        if (!storyIdFromUrl) {
            autoOpenedStoryId.current = null;
            return;
        }

        // Wait until the requested story is available.
        if (!selectedStory) {
            return;
        }

        // Do not open the edit modal for archived stories.
        if (selectedStory.isArchived) {
            return;
        }

        // Only the assigned Product Owner can edit stories.
        if (!canManageStories) {
            return;
        }

        // Do not automatically open the same story more than once.
        if (autoOpenedStoryId.current === storyIdFromUrl) {
            return;
        }

        autoOpenedStoryId.current = storyIdFromUrl;
        openEditForm(selectedStory);
    }, [
        storyIdFromUrl,
        selectedStory,
        canManageStories,
        openEditForm,
    ]);

    const closeForm = () => {
        if (isSaving) return;

        setIsFormOpen(false);
        resetForm();
    };

    const updateCriterion = (id: string, value: string) => {
        setCriteria((previous) =>
            previous.map((criterion) =>
                criterion.id === id
                    ? { ...criterion, description: value }
                    : criterion,
            ),
        );

        setFormError("");
    };

    const addCriterion = () => {
        setCriteria((previous) => [
            ...previous,
            createEmptyCriterion(),
        ]);

        setFormError("");
    };

    const removeCriterion = (id: string) => {
        setCriteria((previous) =>
            previous.length === 1
                ? previous
                : previous.filter((criterion) => criterion.id !== id),
        );

        setFormError("");
    };

    const handleSaveStory = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setFormError("");
        setPageMessage("");

        if (!canManageStories) {
            setFormError(
                "Only the Product Owner assigned to this project can manage stories.",
            );
            return;
        }

        if (!editingStory && !selectedEpicId) {
            setFormError("Please select an epic.");
            return;
        }

        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle) {
            setFormError("Story title is required.");
            return;
        }

        if (cleanTitle.length > 200) {
            setFormError(
                "Story title cannot exceed 200 characters.",
            );
            return;
        }

        if (!cleanDescription) {
            setFormError("Story description is required.");
            return;
        }

        const parsedPoints =
            storyPoints.trim() === ""
                ? null
                : Number(storyPoints);

        const allowedPoints = [1, 2, 3, 5, 8, 13, 21];

        if (
            parsedPoints !== null &&
            !allowedPoints.includes(parsedPoints)
        ) {
            setFormError(
                "Story points must be 1, 2, 3, 5, 8, 13, 21, or empty.",
            );
            return;
        }

        const cleanCriteria = criteria
            .map((criterion) => ({
                ...criterion,
                description: criterion.description.trim(),
            }))
            .filter(
                (criterion) => criterion.description.length > 0,
            );

        if (cleanCriteria.length === 0) {
            setFormError(
                "Please add at least one non-empty acceptance criterion.",
            );
            return;
        }

        const labels = [
            ...new Set(
                labelsInput
                    .split(",")
                    .map((label) => label.trim())
                    .filter(Boolean),
            ),
        ];

        try {
            if (editingStory) {
                const payload: UpdateStoryPayload = {
                    title: cleanTitle,
                    description: cleanDescription,
                    priority,
                    storyPoints: parsedPoints,
                    status,
                    acceptanceCriteria: cleanCriteria,
                    labels,
                };

                await updateStoryMutation.mutateAsync({
                    storyId: editingStory._id,
                    payload,
                });

                setPageMessage("Story updated successfully.");
            } else {
                const payload: CreateStoryPayload = {
                    epicId: selectedEpicId,
                    title: cleanTitle,
                    description: cleanDescription,
                    priority,
                    storyPoints: parsedPoints,
                    acceptanceCriteria: cleanCriteria,
                    labels,
                };

                await createStoryMutation.mutateAsync(payload);

                setPageMessage("Story created successfully.");
            }

            setIsFormOpen(false);
            resetForm();
        } catch (error) {
            setFormError(getErrorMessage(error));
        }
    };

    const handleArchiveStory = async () => {
        if (!storyToArchive || !canManageStories) return;

        setArchiveError("");
        setPageMessage("");

        try {
            await archiveStoryMutation.mutateAsync(storyToArchive._id);

            setStoryToArchive(null);
            setPageMessage("Story archived successfully.");
        } catch (error) {
            setArchiveError(getErrorMessage(error));
        }
    };

    const handleEpicFilterChange = (nextEpicId: string) => {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);

            if (nextEpicId) {
                next.set("epicId", nextEpicId);
            } else {
                next.delete("epicId");
            }

            return next;
        });
    };

    const handleViewAllStories = () => {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            next.delete("storyId");
            return next;
        });
    };

    if (!projectId) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                A project ID is missing from the URL.
            </div>
        );
    }

    if (isProjectLoading || isMembersLoading || isStoriesLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
                <LoaderCircle className="h-6 w-6 animate-spin" />
                <span>Loading stories...</span>
            </div>
        );
    }

    if (isProjectError || isMembersError || isStoriesError) {
        const error = projectError ?? membersError ?? storiesError;

        return (
            <div className="rounded-xl border border-red-200 bg-white p-6">
                <div className="flex items-center gap-3 text-red-700">
                    <CircleAlert className="h-6 w-6" />
                    <h2 className="font-semibold">Could not load stories</h2>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                    {getErrorMessage(error)}
                </p>

                <button
                    type="button"
                    onClick={retryLoading}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <Link
                        to={`/projects/${projectId}/backlog`}
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        ← Back to product backlog
                    </Link>

                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                        User Stories
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        {projectData?.name ?? "Project"} · View and manage
                        project stories
                    </p>
                </div>

                {storyIdFromUrl && (
                    <button
                        type="button"
                        onClick={handleViewAllStories}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        ← View all stories
                    </button>
                )}

                {canManageStories && (
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        <Plus className="h-4 w-4" />
                        Create Story
                    </button>
                )}
            </div>

            {isAdmin && !isProductOwner && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    You have administrator access, but Story management
                    actions are reserved for the Product Owner of this
                    project.
                </div>
            )}

            {pageMessage && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
                >
                    {pageMessage}
                </div>
            )}

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Active stories</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {activeStories.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Ready for development
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-700">
                        {readyStories.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Draft stories</p>
                    <p className="mt-2 text-2xl font-semibold text-blue-700">
                        {draftStories.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">Total story points</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {totalStoryPoints}
                    </p>
                </div>
            </div>

            
{/* Search and filters — show only when viewing all stories */}
{!storyIdFromUrl && (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search stories by title, key, or label..."
            aria-label="Search stories"
            className={`${inputClasses} sm:max-w-md`}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
                value={epicIdFromUrl}
                onChange={(event) =>
                    handleEpicFilterChange(event.target.value)
                }
                aria-label="Filter stories by epic"
                className={`${inputClasses} sm:min-w-64 sm:w-auto`}
            >
                <option value="">All epics</option>

                {epicList.map((epic) => (
                    <option
                        key={epic._id}
                        value={String(epic._id)}
                    >
                        {epic.key} — {epic.name}
                    </option>
                ))}
            </select>

            {/* <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
                <input
                    type="checkbox"
                    checked={includeArchived}
                    onChange={(event) =>
                        setIncludeArchived(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300"
                />
                Show archived
            </label> */}
            <select
    value={statusFilter}
    onChange={(event) =>
        setStatusFilter(
            event.target.value as "ALL" | StoryStatus,
        )
    }
    aria-label="Filter stories by status"
    className={`${inputClasses} sm:w-auto`}
>
    <option value="ALL">All statuses</option>
    <option value="DRAFT">Draft stories</option>
    <option value="READY">Ready stories</option>
</select>
        </div>
    </div>
)}


            {/* Show an error if the requested story is unavailable */}
            {storyIdFromUrl && !selectedStory && !isStoriesLoading && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    This story could not be found in the current project.
                    It may have been deleted or may no longer be available.
                </div>
            )}

            {/* Story list */}
            {visibleStories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <BookOpen className="h-6 w-6 text-slate-500" />
                    </div>

                    <h2 className="mt-4 font-semibold text-slate-900">
                        {storyIdFromUrl
                            ? "Story not available"
                            : search.trim()
                              ? "No matching stories"
                              : epicIdFromUrl
                                ? "No stories for this epic"
                                : includeArchived
                                  ? "No stories found"
                                  : "No active stories yet"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {storyIdFromUrl
                            ? "Check that the story belongs to this project and is available."
                            : search.trim()
                              ? "Try another search term."
                              : epicIdFromUrl
                                ? "Choose another epic or select All epics to view other stories."
                                : "Stories created for this project will appear here."}
                    </p>

                    {canManageStories &&
                        !storyIdFromUrl &&
                        !search.trim() &&
                        !includeArchived &&
                        epicList.length > 0 && (
                            <button
                                type="button"
                                onClick={openCreateForm}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                <Plus className="h-4 w-4" />
                                Create your first story
                            </button>
                        )}
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-[900px] w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Story</th>
                                <th className="px-5 py-3 font-semibold">Epic ID</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Priority</th>
                                <th className="px-5 py-3 font-semibold">Story points</th>
                                {canManageStories && (
                                    <th className="px-5 py-3 text-right font-semibold">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {visibleStories.map((story: Story) => (
                                <tr
                                    key={story._id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-900">
                                            {story.title}
                                        </div>

                                        <div className="mt-1 text-xs text-slate-500">
                                            {story.key}
                                        </div>

                                        <p className="mt-2 max-w-md whitespace-pre-wrap text-xs text-slate-500">
                                            {story.description}
                                        </p>

                                        {story.labels.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {story.labels.map((label) => (
                                                    <span
                                                        key={label}
                                                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {story.acceptanceCriteria.length > 0 && (
                                            <p className="mt-2 text-xs text-slate-500">
                                                {story.acceptanceCriteria.length} acceptance{" "}
                                                {story.acceptanceCriteria.length === 1
                                                    ? "criterion"
                                                    : "criteria"}
                                            </p>
                                        )}

                                        {story.isArchived && (
                                            <span className="mt-2 inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                Archived
                                            </span>
                                        )}
                                    </td>

                                    
<td className="px-5 py-4">
    {(() => {
        const epic = epicList.find(
            (item) => String(item._id) === String(story.epicId),
        );

        return epic ? (
            <div>
                <p className="font-medium text-slate-800">
                    {epic.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    {epic.key}
                </p>
            </div>
        ) : (
            <span className="text-xs text-slate-500">
                Epic unavailable
            </span>
        );
    })()}
</td>


                                    
<td className="px-5 py-4">
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[story.status]}`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                story.status === "READY"
                    ? "bg-emerald-600"
                    : "bg-amber-500"
            }`}
        />
        {story.status === "READY"
            ? "Ready for development"
            : "Draft"}
    </span>
</td>


                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityClasses[story.priority]}`}
                                        >
                                            {story.priority}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-slate-600">
                                        {story.storyPoints ?? "—"}
                                    </td>

                                    {canManageStories && (
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {!story.isArchived && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditForm(story)
                                                            }
                                                            title="Edit story"
                                                            aria-label={`Edit ${story.title}`}
                                                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setStoryToArchive(story);
                                                                setArchiveError("");
                                                            }}
                                                            title="Archive story"
                                                            aria-label={`Archive ${story.title}`}
                                                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {archivedStories.length > 0 && !includeArchived && !storyIdFromUrl && (
                <p className="text-sm text-slate-500">
                    {archivedStories.length} archived{" "}
                    {archivedStories.length === 1
                        ? "story is"
                        : "stories are"}{" "}
                    hidden. Enable “Show archived” to view them.
                </p>
            )}

            {/* Create / Edit Story modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="story-form-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                    >
                        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                            <div>
                                <h2
                                    id="story-form-title"
                                    className="text-lg font-semibold text-slate-900"
                                >
                                    {editingStory ? "Edit Story" : "Create Story"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editingStory
                                        ? `Update ${editingStory.key}`
                                        : "Add a user story to your product backlog."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={isSaving}
                                aria-label="Close form"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSaveStory}
                            noValidate
                            className="space-y-5 p-6"
                        >
                            {formError && (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                >
                                    {formError}
                                </div>
                            )}

                            {!editingStory && (
                                <div>
                                    <label
                                        htmlFor="story-epic"
                                        className={labelClasses}
                                    >
                                        Epic <span className="text-red-500">*</span>
                                    </label>

                                    {isEpicsLoading ? (
                                        <p className="text-sm text-slate-500">
                                            Loading epics...
                                        </p>
                                    ) : isEpicsError ? (
                                        <div className="text-sm text-red-600">
                                            <p>{getErrorMessage(epicsError)}</p>
                                            <button
                                                type="button"
                                                onClick={() => refetchEpics()}
                                                className="mt-1 underline"
                                            >
                                                Retry loading epics
                                            </button>
                                        </div>
                                    ) : epicList.length === 0 ? (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                            Create an epic before creating a story.
                                        </div>
                                    ) : (
                                        <select
                                            id="story-epic"
                                            value={selectedEpicId}
                                            onChange={(event) => {
                                                setSelectedEpicId(event.target.value);
                                                setFormError("");
                                            }}
                                            required
                                            className={inputClasses}
                                        >
                                            <option value="">Select an epic</option>
                                            {epicList.map((epic) => (
                                                <option
                                                    key={epic._id}
                                                    value={String(epic._id)}
                                                >
                                                    {epic.key} — {epic.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            <div>
                                <label htmlFor="story-title" className={labelClasses}>
                                    Story title <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="story-title"
                                    value={title}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                        setFormError("");
                                    }}
                                    maxLength={200}
                                    required
                                    placeholder="e.g. As a user, I want to reset my password"
                                    className={inputClasses}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="story-description"
                                    className={labelClasses}
                                >
                                    Description <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    id="story-description"
                                    value={description}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                        setFormError("");
                                    }}
                                    rows={4}
                                    required
                                    placeholder="Describe the user story and its expected behavior..."
                                    className={inputClasses}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label
                                        htmlFor="story-priority"
                                        className={labelClasses}
                                    >
                                        Priority
                                    </label>

                                    <select
                                        id="story-priority"
                                        value={priority}
                                        onChange={(event) => {
                                            setPriority(
                                                event.target.value as StoryPriority,
                                            );
                                            setFormError("");
                                        }}
                                        className={inputClasses}
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="story-points"
                                        className={labelClasses}
                                    >
                                        Story points
                                    </label>

                                    <select
                                        id="story-points"
                                        value={storyPoints}
                                        onChange={(event) => {
                                            setStoryPoints(event.target.value);
                                            setFormError("");
                                        }}
                                        className={inputClasses}
                                    >
                                        <option value="">Not estimated</option>
                                        {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                                            <option key={points} value={points}>
                                                {points}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                
<div>
    <label htmlFor="story-status" className={labelClasses}>
        Status
    </label>

    {editingStory ? (
        <select
            id="story-status"
            value={status}
            onChange={(event) => {
                setStatus(event.target.value as StoryStatus);
                setFormError("");
            }}
            className={inputClasses}
        >
            <option value="DRAFT">Draft</option>
            <option value="READY">Ready</option>
        </select>
    ) : (
        <div>
            <div className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">
                Draft
            </div>

            <p className="mt-1 text-xs text-slate-500">
                New stories always start as Draft. Complete the story
                and its Definition of Ready checks before marking it Ready.
            </p>
        </div>
    )}
</div>

                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label className={labelClasses}>
                                        Acceptance criteria{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={addCriterion}
                                        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-950"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add criterion
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {criteria.map((criterion, index) => (
                                        <div
                                            key={criterion.id}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="pt-2.5 text-xs text-slate-400">
                                                {index + 1}.
                                            </span>

                                            <textarea
                                                value={criterion.description}
                                                onChange={(event) =>
                                                    updateCriterion(
                                                        criterion.id,
                                                        event.target.value,
                                                    )
                                                }
                                                rows={2}
                                                placeholder="Describe an acceptance condition..."
                                                aria-label={`Acceptance criterion ${index + 1}`}
                                                className={inputClasses}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCriterion(criterion.id)
                                                }
                                                disabled={criteria.length === 1}
                                                title="Remove criterion"
                                                aria-label={`Remove criterion ${index + 1}`}
                                                className="mt-1 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Add at least one non-empty acceptance criterion.
                                    Empty rows are ignored if another criterion contains text.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="story-labels"
                                    className={labelClasses}
                                >
                                    Labels
                                </label>

                                <input
                                    id="story-labels"
                                    value={labelsInput}
                                    onChange={(event) => {
                                        setLabelsInput(event.target.value);
                                        setFormError("");
                                    }}
                                    placeholder="frontend, authentication, urgent"
                                    className={inputClasses}
                                />

                                <p className="mt-1 text-xs text-slate-500">
                                    Separate labels with commas.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={isSaving}
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        isSaving ||
                                        (!editingStory &&
                                            (isEpicsLoading ||
                                                isEpicsError ||
                                                epicList.length === 0))
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}

                                    {isSaving
                                        ? "Saving..."
                                        : editingStory
                                          ? "Save Changes"
                                          : "Create Story"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Archive confirmation modal */}
            {storyToArchive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="archive-story-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <Archive className="h-5 w-5 text-red-600" />
                            </div>

                            <div>
                                <h2
                                    id="archive-story-title"
                                    className="text-lg font-semibold text-slate-900"
                                >
                                    Archive story?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Are you sure you want to archive{" "}
                                    <span className="font-semibold text-slate-900">
                                        {storyToArchive.key} — {storyToArchive.title}
                                    </span>
                                    ? It will be hidden from the active backlog.
                                </p>
                            </div>
                        </div>

                        {archiveError && (
                            <div
                                role="alert"
                                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {archiveError}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (archiveStoryMutation.isPending) return;

                                    setStoryToArchive(null);
                                    setArchiveError("");
                                }}
                                disabled={archiveStoryMutation.isPending}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleArchiveStory}
                                disabled={archiveStoryMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {archiveStoryMutation.isPending && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}

                                {archiveStoryMutation.isPending
                                    ? "Archiving..."
                                    : "Yes, archive"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
