
import {useEffect,
        useState,
    type FormEvent,
} from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams, } from "react-router-dom";
import axios from "axios";
import {
    Archive,
    BookOpen,
    CalendarDays,
    CircleAlert,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    CheckCircle2,
    Circle,
    ClipboardCheck,
    X,
} from "lucide-react";

import type { RootState } from "../../store/store";

import { useGetProjectById } from "../../hooks/Project/ProjectHook";
import { useGetProjectMembers } from "../../hooks/Project/ProjectMemberHook";

import {
    useGetEpicsByProject,
    useCreateEpic,
    useUpdateEpic,
    useArchiveEpic,
} from "../../hooks/Epic/EpicHook";

import {
    useGetStoriesByProject,
    useUpdateStory,
} from "../../hooks/Story/StoryHook";

import type {
    Epic,
    EpicPriority,
    EpicStatus,
    CreateEpicPayload,
    UpdateEpicPayload,
} from "../../services/Epic/epicService";

import type {
    Story,
    StoryPriority,
    StoryStatus,
} from "../../services/Story/storyService";

type ReadinessCheck = {
    id: string;
    label: string;
    description: string;
};

type EpicFormErrors = {
    name?: string;
    key?: string;
    description?: string;
    priority?: string;
    status?: string;
    startDate?: string;
    targetDate?: string;
    targetRelease?: string;
};

const DEFINITION_OF_READY: ReadinessCheck[] = [
    {
        id: "clear-description",
        label: "Story description is clear",
        description:
            "The user need and expected outcome are understandable.",
    },
    {
        id: "acceptance-criteria",
        label: "Acceptance criteria are complete",
        description:
            "Every acceptance criterion has a meaningful description.",
    },
    {
        id: "story-points",
        label: "Story points are estimated",
        description: "The story has a valid estimate.",
    },
    {
        id: "priority",
        label: "Priority is confirmed",
        description:
            "The Product Owner has confirmed the story priority.",
    },
    {
        id: "dependencies",
        label: "Dependencies have been reviewed",
        description:
            "Known dependencies and blockers have been identified.",
    },
    {
        id: "understood",
        label: "The team understands the story",
        description:
            "There are no unresolved major questions.",
    },
];

type EpicFormValues = {
    name: string;
    key: string;
    description: string;
    priority: EpicPriority;
    status: EpicStatus;
    startDate: string;
    targetDate: string;
    targetRelease: string;
};

const initialForm: EpicFormValues = {
    name: "",
    key: "",
    description: "",
    priority: "MEDIUM",
    status: "OPEN",
    startDate: "",
    targetDate: "",
    targetRelease: "",
};

const priorities: EpicPriority[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];

const statuses: EpicStatus[] = [
    "OPEN",
    "IN_PROGRESS",
    "COMPLETED",
];

const VALID_STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

const VALID_STORY_PRIORITIES: StoryPriority[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
];

const priorityClasses: Record<EpicPriority, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};

const epicStatusClasses: Record<EpicStatus, string> = {
    OPEN: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
};

const storyPriorityClasses: Record<StoryPriority, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
};

const storyStatusClasses: Record<StoryStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    READY: "bg-emerald-100 text-emerald-700",
};

const formatDate = (date: string | null): string => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString();
};

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

export default function ProductBacklogPage() {

    const [search, setSearch] = useState("");

const [debouncedSearch, setDebouncedSearch] = useState("");

useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
}, [search]);

    const { projectId = "" } = useParams<{
        projectId: string;
    }>();

    const navigate = useNavigate();

    const currentUser = useSelector(
        (state: RootState) => state.auth.user,
    );

    // Project
    const {
        data: projectData,
        isLoading: isProjectLoading,
        isError: isProjectError,
        error: projectError,
        refetch: refetchProject,
    } = useGetProjectById(projectId);

    // Project members
    const {
        data: projectMembersData,
        isLoading: isMembersLoading,
        isError: isMembersError,
        error: membersError,
        refetch: refetchMembers,
    } = useGetProjectMembers(projectId);

    // Epics
    const {
        data: epics,
        isLoading: isEpicsLoading,
        isError: isEpicsError,
        error: epicsError,
        refetch: refetchEpics,
    } = useGetEpicsByProject(projectId, false);

    // Stories
    const {
        data: stories,
        isLoading: isStoriesLoading,
        isError: isStoriesError,
        error: storiesError,
        refetch: refetchStories,
    } = useGetStoriesByProject(projectId, {
    search: debouncedSearch || undefined,
    includeArchived: false,
    page: 1,
    limit: 100,
});
    const createEpicMutation = useCreateEpic(projectId);
    const updateEpicMutation = useUpdateEpic(projectId);
    const archiveEpicMutation = useArchiveEpic(projectId);
    const updateStoryMutation = useUpdateStory(projectId);

    // Epic modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEpic, setEditingEpic] = useState<Epic | null>(
        null,
    );
    const [archivingEpic, setArchivingEpic] = useState<Epic | null>(
        null,
    );

    const [form, setForm] = useState<EpicFormValues>({
        ...initialForm,
    });
    const [formError, setFormError] = useState("");
    const [formErrors, setFormErrors] =
        useState<EpicFormErrors>({}); const [actionError, setActionError] = useState("");

    // Search and filters

    // Story readiness modal
    const [reviewingStory, setReviewingStory] =
        useState<Story | null>(null);

    const [readinessChecks, setReadinessChecks] = useState<
        Record<string, boolean>
    >({});

    const [readinessError, setReadinessError] = useState("");



    const members = projectMembersData?.members ?? [];
    const allEpics = epics ?? [];

    const allStories: Story[] = stories?.stories ?? [];
    const pagination = stories?.pagination;
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

    // Only the assigned Product Owner can manage the backlog.
    // The backend must independently enforce this permission.
    const canManageBacklog = isProductOwner;

    const activeStories = allStories.filter(
        (story) => !story.isArchived,
    );

    const visibleStories = activeStories;

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

const normalizedSearch = debouncedSearch.toLowerCase();

    const visibleEpics = allEpics.filter((epic) => {
        if (!normalizedSearch) {
            return true;
        }

        const epicStories = visibleStories.filter(
            (story) =>
                String(story.epicId) === String(epic._id),
        );

        return (
            epic.name.toLowerCase().includes(normalizedSearch) ||
            epic.key.toLowerCase().includes(normalizedSearch) ||
            epic.description.toLowerCase().includes(normalizedSearch) ||
            epicStories.some(
                (story) =>
                    story.title.toLowerCase().includes(normalizedSearch) ||
                    story.key.toLowerCase().includes(normalizedSearch) ||
                    story.description.toLowerCase().includes(normalizedSearch) ||
                    story.labels.some((label) =>
                        label.toLowerCase().includes(normalizedSearch),
                    ),
            )
        );
    });

    const isSaving =
        createEpicMutation.isPending ||
        updateEpicMutation.isPending;

    const isReadinessUpdating =
        updateStoryMutation.isPending;

    const retryLoading = async () => {
        await Promise.all([
            refetchProject(),
            refetchMembers(),
            refetchEpics(),
            refetchStories(),
        ]);
    };

    // --------------------------------------------------
    // Epic create and edit handlers
    // --------------------------------------------------

    const openCreateForm = () => {
        setEditingEpic(null);
        setForm({ ...initialForm });
        setFormError("");
        setFormErrors({});
        setActionError("");
        setIsFormOpen(true);
    };

    const openEditForm = (epic: Epic) => {
        setEditingEpic(epic);

        setForm({
            name: epic.name,
            key: epic.key,
            description: epic.description,
            priority: epic.priority,
            status: epic.status,
            startDate: epic.startDate?.slice(0, 10) ?? "",
            targetDate: epic.targetDate?.slice(0, 10) ?? "",
            targetRelease: epic.targetRelease ?? "",
        });

        setFormError("");
        setFormErrors({});
        setActionError("");
        setIsFormOpen(true);
    };

    const closeForm = () => {
        if (isSaving) return;

        setIsFormOpen(false);
        setEditingEpic(null);
        setForm({ ...initialForm });
        setFormError("");
        setFormErrors({});
    };


    const validateEpicForm = (
        form: EpicFormValues,
        isEditing: boolean,
    ): EpicFormErrors => {
        const errors: EpicFormErrors = {};

        const name = form.name.trim();
        const key = form.key.trim();
        const description = form.description.trim();
        const targetRelease = form.targetRelease.trim();

        // Epic name
        if (!name) {
            errors.name = "Epic name is required.";
        } else if (name.length < 3) {
            errors.name = "Epic name must be at least 3 characters.";
        } else if (name.length > 100) {
            errors.name = "Epic name cannot exceed 100 characters.";
        }

        // Epic key: required only when creating
        if (!isEditing) {
            if (!key) {
                errors.key = "Epic key is required.";
            } else if (key.length < 2) {
                errors.key = "Epic key must be at least 2 characters.";
            } else if (key.length > 20) {
                errors.key = "Epic key cannot exceed 20 characters.";
            } else if (!/^[A-Z0-9_-]+$/.test(key)) {
                errors.key =
                    "Use only uppercase letters, numbers, underscores, or hyphens.";
            }
        }

        // Description
        if (!description) {
            errors.description = "Epic description is required.";
        } else if (description.length > 2000) {
            errors.description =
                "Description cannot exceed 2,000 characters.";
        }

        // Priority
        if (!priorities.includes(form.priority)) {
            errors.priority = "Please select a valid priority.";
        }

        // Status (relevant when editing)
        if (
            isEditing &&
            !statuses.includes(form.status)
        ) {
            errors.status = "Please select a valid epic status.";
        }

        // Start date
        if (form.startDate) {
            const startDate = new Date(
                `${form.startDate}T00:00:00`,
            );

            if (Number.isNaN(startDate.getTime())) {
                errors.startDate = "Please enter a valid start date.";
            }
        }

        // Target date
        if (form.targetDate) {
            const targetDate = new Date(
                `${form.targetDate}T00:00:00`,
            );

            if (Number.isNaN(targetDate.getTime())) {
                errors.targetDate = "Please enter a valid target date.";
            } else if (
                form.startDate &&
                form.targetDate < form.startDate
            ) {
                errors.targetDate =
                    "Target date cannot be earlier than the start date.";
            }
        }

        // Target release
        if (targetRelease.length > 100) {
            errors.targetRelease =
                "Target release cannot exceed 100 characters.";
        }

        return errors;
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setFormError("");
        setFormErrors({});

        const errors = validateEpicForm(
            form,
            Boolean(editingEpic),
        );

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const name = form.name.trim();
        const key = form.key.trim().toUpperCase();
        const description = form.description.trim();

        const sharedDates = {
            startDate: form.startDate || null,
            targetDate: form.targetDate || null,
            targetRelease: form.targetRelease.trim() || null,
        };

        try {
            if (editingEpic) {
                const payload: UpdateEpicPayload = {
                    name,
                    description,
                    status: form.status,
                    priority: form.priority,
                    ...sharedDates,
                };

                await updateEpicMutation.mutateAsync({
                    epicId: editingEpic._id,
                    data: payload,
                });
            } else {
                const payload: CreateEpicPayload = {
                    name,
                    key,
                    description,
                    priority: form.priority,
                    ...sharedDates,
                };

                await createEpicMutation.mutateAsync(payload);
            }

            setIsFormOpen(false);
            setEditingEpic(null);
            setForm({ ...initialForm });
            setFormError("");
            setFormErrors({});
        } catch (error) {
            setFormError(getErrorMessage(error));
        }
    };

    // --------------------------------------------------
    // Epic archive handler
    // --------------------------------------------------

    const handleArchive = async () => {
        if (!archivingEpic || archiveEpicMutation.isPending) {
            return;
        }

        setActionError("");

        try {
            await archiveEpicMutation.mutateAsync(
                archivingEpic._id,
            );

            setArchivingEpic(null);
        } catch (error) {
            setActionError(getErrorMessage(error));
        }
    };

    // --------------------------------------------------
    // Story Definition of Ready
    // --------------------------------------------------

    const openReadinessReview = (story: Story) => {
        setReviewingStory(story);
        setReadinessChecks({});
        setReadinessError("");
    };

    const closeReadinessReview = () => {
        // Do not close the modal while the API request is running.
        if (isReadinessUpdating) return;

        setReviewingStory(null);
        setReadinessChecks({});
        setReadinessError("");
    };

    const allReadinessChecksComplete =
        DEFINITION_OF_READY.every(
            (check) => readinessChecks[check.id] === true,
        );

    const reviewingStoryCriteria =
        reviewingStory?.acceptanceCriteria ?? [];

    const reviewingStoryPoints =
        reviewingStory?.storyPoints;

    const reviewingStoryPriority =
        reviewingStory?.priority;

    const hasValidStoryPoints =
        typeof reviewingStoryPoints === "number" &&
        VALID_STORY_POINTS.includes(reviewingStoryPoints);

    const hasValidPriority =
        typeof reviewingStoryPriority === "string" &&
        VALID_STORY_PRIORITIES.includes(
            reviewingStoryPriority as StoryPriority,
        );

    const hasValidAcceptanceCriteria =
        reviewingStoryCriteria.length > 0 &&
        reviewingStoryCriteria.every(
            (criterion) =>
                typeof criterion.description === "string" &&
                criterion.description.trim().length > 0,
        );

    const canMarkStoryReady =
        Boolean(reviewingStory) &&
        Boolean(reviewingStory?.title.trim()) &&
        Boolean(reviewingStory?.description.trim()) &&
        hasValidStoryPoints &&
        hasValidPriority &&
        hasValidAcceptanceCriteria &&
        allReadinessChecksComplete;

    const handleMarkStoryReady = async () => {
        if (
            !reviewingStory ||
            !canMarkStoryReady ||
            isReadinessUpdating
        ) {
            return;
        }

        setReadinessError("");

        try {
            await updateStoryMutation.mutateAsync({
                storyId: reviewingStory._id,
                payload: {
                    status: "READY",
                },
            });

            // The mutation hook invalidates the stories query.
            // Close only after the update succeeds.
            setReviewingStory(null);
            setReadinessChecks({});
            setReadinessError("");
        } catch (error) {
            // Keep the modal open and show the actual API error.
            setReadinessError(getErrorMessage(error));
        }
    };

    const openCreateStory = (epicId: string) => {
        navigate(
            `/projects/${projectId}/stories?epicId=${encodeURIComponent(
                epicId,
            )}`,
        );
    };

    // --------------------------------------------------
    // Loading and error states
    // --------------------------------------------------

    if (!projectId) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                A project ID is missing from the URL.
            </div>
        );
    }

    if (
        isProjectLoading ||
        isMembersLoading ||
        isEpicsLoading ||
        isStoriesLoading
    ) {
        return (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
                <LoaderCircle className="h-6 w-6 animate-spin" />
                <span>Loading product backlog...</span>
            </div>
        );
    }

    if (
        isProjectError ||
        isMembersError ||
        isEpicsError ||
        isStoriesError
    ) {
        const error =
            projectError ??
            membersError ??
            epicsError ??
            storiesError;

        return (
            <div className="rounded-xl border border-red-200 bg-white p-6">
                <div className="flex items-center gap-3 text-red-700">
                    <CircleAlert className="h-6 w-6" />
                    <h2 className="font-semibold">
                        Could not load the product backlog
                    </h2>
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

    // --------------------------------------------------
    // Page
    // --------------------------------------------------

    return (
        <div className="space-y-6">
            {/* Breadcrumb and page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <Link
                        to={`/projects/${projectId}`}
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        Projects
                    </Link>

                    <p className="mt-2 text-sm font-medium text-slate-500">
                        {projectData?.name ?? "Project"}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Product Backlog
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage epics and user stories before sprint
                        planning.
                    </p>
                </div>

                {canManageBacklog && (
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        <Plus className="h-4 w-4" />
                        Create Epic
                    </button>
                )}
            </div>

            {isAdmin && !isProductOwner && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    You have administrator access, but backlog
                    management actions are reserved for the Product
                    Owner assigned to this project.
                </div>
            )}

            {actionError && (
                <div
                    role="alert"
                    className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    <p>{actionError}</p>

                    <button
                        type="button"
                        onClick={() => setActionError("")}
                        aria-label="Dismiss error"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Backlog statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Total epics
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {allEpics.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        User stories
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {activeStories.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Ready stories
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-700">
                        {readyStories.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm text-slate-500">
                        Draft stories
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-blue-700">
                        {draftStories.length}
                    </p>
                </div>
            </div>

            {/* Backlog readiness progress */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Backlog Readiness
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Stories marked Ready compared with all
                            active stories.
                        </p>
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                        {activeStories.length > 0
                            ? Math.round(
                                (readyStories.length /
                                    activeStories.length) *
                                100,
                            )
                            : 0}
                        %
                    </span>
                </div>

                <div
                    className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label="Backlog readiness"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={
                        activeStories.length > 0
                            ? Math.round(
                                (readyStories.length /
                                    activeStories.length) *
                                100,
                            )
                            : 0
                    }
                >
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                            width: `${activeStories.length > 0
                                ? (readyStories.length /
                                    activeStories.length) *
                                100
                                : 0
                                }%`,
                        }}
                    />
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                    <span>
                        <span className="font-semibold text-emerald-700">
                            {readyStories.length}
                        </span>{" "}
                        Ready
                    </span>

                    <span>
                        <span className="font-semibold text-blue-700">
                            {draftStories.length}
                        </span>{" "}
                        Draft
                    </span>

                    <span>
                        <span className="font-semibold text-slate-900">
                            {totalStoryPoints}
                        </span>{" "}
                        Total story points
                    </span>
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder="Search epic or story..."
                    aria-label="Search epics and stories"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 sm:max-w-md"
                />


            </div>

            {/* Epics and their stories */}
            {visibleEpics.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <CalendarDays className="h-6 w-6 text-slate-500" />
                    </div>

                    <h2 className="mt-4 font-semibold text-slate-900">
                        {normalizedSearch
                            ? "No matching epics or stories"
                            : "No epics yet"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {normalizedSearch
                            ? "Try another search term."
                            : "Create an epic, then add user stories underneath it."}
                    </p>

                    {canManageBacklog && !normalizedSearch && (
                        <button
                            type="button"
                            onClick={openCreateForm}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create your first epic
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-5">
                    {visibleEpics.map((epic) => {
                        const epicStories = visibleStories.filter(
                            (story) => {
                                if (
                                    String(story.epicId) !==
                                    String(epic._id)
                                ) {
                                    return false;
                                }

                                if (!normalizedSearch) {
                                    return true;
                                }

                                return (
                                    epic.name
                                        .toLowerCase()
                                        .includes(normalizedSearch) ||
                                    epic.key
                                        .toLowerCase()
                                        .includes(normalizedSearch) ||
                                    epic.description
                                        .toLowerCase()
                                        .includes(normalizedSearch) ||
                                    story.title
                                        .toLowerCase()
                                        .includes(normalizedSearch) ||
                                    story.key
                                        .toLowerCase()
                                        .includes(normalizedSearch) ||
                                    story.labels.some((label) =>
                                        label
                                            .toLowerCase()
                                            .includes(normalizedSearch),
                                    )
                                );
                            },
                        );

                        const epicActiveStories =
                            epicStories.filter(
                                (story) => !story.isArchived,
                            );

                        const epicReadyStories =
                            epicActiveStories.filter(
                                (story) =>
                                    story.status === "READY",
                            );

                        const readiness =
                            epicActiveStories.length > 0
                                ? Math.round(
                                    (epicReadyStories.length /
                                        epicActiveStories.length) *
                                    100,
                                )
                                : 0;

                        return (
                            <section
                                key={epic._id}
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                            >
                                {/* Epic header */}
                                <div className="border-b border-slate-200 p-5">
                                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {epic.name}
                                                </h2>

                                                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                                                    {epic.key}
                                                </span>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClasses[epic.priority]}`}
                                                >
                                                    {epic.priority}
                                                </span>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${epicStatusClasses[epic.status]}`}
                                                >
                                                    {epic.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </div>

                                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                                {epic.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                <span>
                                                    {epicActiveStories.length}{" "}
                                                    {epicActiveStories.length ===
                                                        1
                                                        ? "active story"
                                                        : "active stories"}
                                                </span>

                                                <span>
                                                    {epicReadyStories.length}{" "}
                                                    Ready
                                                </span>

                                                <span>
                                                    {
                                                        epicActiveStories.filter(
                                                            (story) =>
                                                                story.status ===
                                                                "DRAFT",
                                                        ).length
                                                    }{" "}
                                                    Draft
                                                </span>

                                                {epic.targetRelease && (
                                                    <span>
                                                        Release:{" "}
                                                        {epic.targetRelease}
                                                    </span>
                                                )}

                                                {epic.targetDate && (
                                                    <span>
                                                        Target:{" "}
                                                        {formatDate(
                                                            epic.targetDate,
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 max-w-sm">
                                                <div className="mb-1 flex justify-between text-xs text-slate-500">
                                                    <span>
                                                        Story readiness
                                                    </span>
                                                    <span>
                                                        {readiness}%
                                                    </span>
                                                </div>

                                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500"
                                                        style={{
                                                            width: `${readiness}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {canManageBacklog && (
                                            <div className="flex flex-wrap gap-2 lg:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openCreateStory(
                                                            String(epic._id),
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add Story
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditForm(epic)
                                                    }
                                                    aria-label={`Edit ${epic.name}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActionError("");
                                                        setArchivingEpic(epic);
                                                    }}
                                                    aria-label={`Archive ${epic.name}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
                                                >
                                                    <Archive className="h-3.5 w-3.5" />
                                                    Archive
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stories nested under the epic */}
                                <div className="p-4 sm:p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                            <BookOpen className="h-4 w-4 text-slate-500" />
                                            User Stories

                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                                {epicStories.length}
                                            </span>
                                        </h3>
                                    </div>

                                    {epicStories.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                                            <p className="text-sm text-slate-500">
                                                {normalizedSearch
                                                    ? "No stories match your search in this epic."
                                                    : "No stories have been added to this epic yet."}
                                            </p>

                                            {canManageBacklog &&
                                                !normalizedSearch && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openCreateStory(
                                                                String(epic._id),
                                                            )
                                                        }
                                                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 hover:text-blue-700"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Create the first story
                                                    </button>
                                                )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {epicStories.map(
                                                (story: Story) => (
                                                    <div
                                                        key={story._id}
                                                        className="rounded-lg border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50 sm:p-4"
                                                    >
                                                        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-xs font-semibold text-slate-500">
                                                                        {story.key}
                                                                    </span>

                                                                    <span
                                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${storyStatusClasses[story.status]}`}
                                                                    >
                                                                        {story.status}
                                                                    </span>

                                                                    <span
                                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${storyPriorityClasses[story.priority]}`}
                                                                    >
                                                                        {story.priority}
                                                                    </span>

                                                                    {story.isArchived && (
                                                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                                                                            Archived
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <h4 className="mt-2 font-medium text-slate-900">
                                                                    {story.title}
                                                                </h4>

                                                                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                                                                    {story.description}
                                                                </p>

                                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                                        {story.storyPoints ??
                                                                            "Not estimated"}{" "}
                                                                        {story.storyPoints ===
                                                                            1
                                                                            ? "point"
                                                                            : typeof story.storyPoints ===
                                                                                "number"
                                                                                ? "points"
                                                                                : ""}
                                                                    </span>

                                                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                                                                        {
                                                                            story
                                                                                .acceptanceCriteria
                                                                                .length
                                                                        }{" "}
                                                                        acceptance{" "}
                                                                        {story
                                                                            .acceptanceCriteria
                                                                            .length ===
                                                                            1
                                                                            ? "criterion"
                                                                            : "criteria"}
                                                                    </span>

                                                                    {story.labels.map(
                                                                        (label) => (
                                                                            <span
                                                                                key={label}
                                                                                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600"
                                                                            >
                                                                                {label}
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>


                                                            {canManageBacklog &&
                                                                !story.isArchived && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            navigate(
                                                                                `/projects/${projectId}/stories?storyId=${story._id}`,
                                                                            );
                                                                        }}
                                                                        className="self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white"
                                                                    >
                                                                        View / Edit
                                                                    </button>
                                                                )}


                                                            {canManageBacklog &&
                                                                !story.isArchived &&
                                                                story.status ===
                                                                "DRAFT" && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openReadinessReview(
                                                                                story,
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-2 self-start rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                                                                    >
                                                                        <ClipboardCheck className="h-4 w-4" />
                                                                        Review readiness
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            {/* Create / edit epic modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="epic-form-title"
                        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="epic-form-title"
                                    className="text-xl font-bold text-slate-900"
                                >
                                    {editingEpic
                                        ? "Edit Epic"
                                        : "Create Epic"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editingEpic
                                        ? "Update the epic details."
                                        : "Add a new epic to this project."}
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

                        {formError && (
                            <div
                                role="alert"
                                className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {formError}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="mt-5 space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="epic-name"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Epic name *
                                    </label>

                                    <input
                                        id="epic-name"
                                        required
                                        maxLength={100}
                                        value={form.name}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                name: event.target.value,
                                            });
                                            setFormError("");
                                        }}
                                        placeholder="User Authentication"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-xs text-red-600" role="alert">
                                            {formErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="epic-key"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Epic key *
                                    </label>

                                    <input
                                        id="epic-key"
                                        required
                                        maxLength={20}
                                        disabled={Boolean(editingEpic)}
                                        value={form.key}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                key: event.target.value
                                                    .toUpperCase()
                                                    .replace(
                                                        /[^A-Z0-9_-]/g,
                                                        "",
                                                    ),
                                            });
                                            setFormError("");
                                        }}
                                        placeholder="AUTH"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-slate-500 disabled:bg-slate-100"
                                    />
                                    {formErrors.key && (
                                        <p className="mt-1 text-xs text-red-600" role="alert">
                                            {formErrors.key}
                                        </p>
                                    )}

                                    <p className="mt-1 text-xs text-slate-500">
                                        Use a unique key for this epic.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="epic-description"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Description *
                                </label>

                                <textarea
                                    id="epic-description"
                                    required
                                    rows={3}
                                    maxLength={2000}
                                    value={form.description}
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            description: event.target.value,
                                        });
                                        setFormError("");
                                    }}
                                    placeholder="Describe the goal and scope of this epic..."
                                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                />
                                {formErrors.description && (
                                    <p className="mt-1 text-xs text-red-600" role="alert">
                                        {formErrors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="epic-priority"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Priority
                                    </label>

                                    <select
                                        id="epic-priority"
                                        value={form.priority}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                priority: event.target
                                                    .value as EpicPriority,
                                            });
                                            setFormError("");
                                        }}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    >
                                        {priorities.map((priority) => (
                                            <option
                                                key={priority}
                                                value={priority}
                                            >
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* <div>
                                    <label
                                        htmlFor="epic-release"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Target release
                                    </label>

                                    <input
                                        id="epic-release"
                                        maxLength={100}
                                        value={form.targetRelease}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                targetRelease:
                                                    event.target.value,
                                            });
                                            setFormError("");
                                        }}
                                        placeholder="Version 1.0"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    />
                                </div> */}

                                <div>
                                    <label
                                        htmlFor="epic-start-date"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Start date
                                    </label>

                                    <input
                                        id="epic-start-date"
                                        type="date"
                                        value={form.startDate}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                startDate:
                                                    event.target.value,
                                            });
                                            setFormError("");
                                        }}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="epic-target-date"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Target date
                                    </label>

                                    <input
                                        id="epic-target-date"
                                        type="date"
                                        min={form.startDate || undefined}
                                        value={form.targetDate}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                targetDate:
                                                    event.target.value,
                                            });
                                            setFormError("");
                                        }}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    />
                                </div>
                            </div>

                            {editingEpic && (
                                <div>
                                    <label
                                        htmlFor="epic-status"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="epic-status"
                                        value={form.status}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                status: event.target
                                                    .value as EpicStatus,
                                            });
                                            setFormError("");
                                        }}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                                    >
                                        {statuses.map((status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={isSaving}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}

                                    {editingEpic
                                        ? "Save Changes"
                                        : "Create Epic"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Archive epic confirmation */}
            {archivingEpic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="archive-epic-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                            <Archive className="h-5 w-5 text-red-700" />
                        </div>

                        <h2
                            id="archive-epic-title"
                            className="mt-4 text-lg font-bold text-slate-900"
                        >
                            Archive this epic?
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            You are about to archive{" "}
                            <span className="font-semibold text-slate-900">
                                {archivingEpic.name}
                            </span>
                            . This action may affect how it appears
                            in the product backlog.
                        </p>

                        {actionError && (
                            <p
                                role="alert"
                                className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {actionError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setArchivingEpic(null);
                                    setActionError("");
                                }}
                                disabled={archiveEpicMutation.isPending}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleArchive}
                                disabled={archiveEpicMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {archiveEpicMutation.isPending && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}

                                {archiveEpicMutation.isPending
                                    ? "Archiving..."
                                    : "Archive Epic"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Story readiness review modal */}
            {reviewingStory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="readiness-title"
                        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                    >
                        {/* Modal heading */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {reviewingStory.key}
                                </p>

                                <h2
                                    id="readiness-title"
                                    className="mt-1 text-xl font-bold text-slate-900"
                                >
                                    Review story readiness
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Confirm that this story is ready
                                    for sprint planning.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeReadinessReview}
                                disabled={isReadinessUpdating}
                                aria-label="Close readiness review"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Story information */}
                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="font-semibold text-slate-900">
                                {reviewingStory.title}
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                                {reviewingStory.description}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-md bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200">
                                    Priority:{" "}
                                    {reviewingStory.priority}
                                </span>

                                <span className="rounded-md bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200">
                                    Story points:{" "}
                                    {reviewingStory.storyPoints ??
                                        "Not estimated"}
                                </span>

                                <span className="rounded-md bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200">
                                    Acceptance criteria:{" "}
                                    {reviewingStoryCriteria.length}
                                </span>
                            </div>
                        </div>

                        {/* Definition of Ready checklist */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-slate-900">
                                    Definition of Ready
                                </h3>

                                <span className="text-xs text-slate-500">
                                    {
                                        DEFINITION_OF_READY.filter(
                                            (check) =>
                                                readinessChecks[
                                                check.id
                                                ] === true,
                                        ).length
                                    }{" "}
                                    of {DEFINITION_OF_READY.length}{" "}
                                    completed
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Check each item after confirming that
                                the requirement has been satisfied.
                            </p>

                            <div className="mt-3 space-y-3">
                                {DEFINITION_OF_READY.map((check) => {
                                    const checked =
                                        readinessChecks[check.id] ===
                                        true;

                                    return (
                                        <label
                                            key={check.id}
                                            className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                disabled={
                                                    isReadinessUpdating
                                                }
                                                onChange={(event) => {
                                                    setReadinessChecks(
                                                        (previous) => ({
                                                            ...previous,
                                                            [check.id]:
                                                                event.target
                                                                    .checked,
                                                        }),
                                                    );

                                                    setReadinessError("");
                                                }}
                                                className="mt-1 h-4 w-4 rounded border-slate-300"
                                            />

                                            <span className="flex-1">
                                                <span className="block text-sm font-medium text-slate-800">
                                                    {check.label}
                                                </span>

                                                <span className="mt-1 block text-xs text-slate-500">
                                                    {check.description}
                                                </span>
                                            </span>

                                            {checked ? (
                                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                            ) : (
                                                <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Validation summary */}
                        {!canMarkStoryReady &&
                            !isReadinessUpdating && (
                                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                    <p className="text-sm font-medium text-amber-900">
                                        Story is not ready yet
                                    </p>

                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-800">
                                        {!reviewingStory.title.trim() && (
                                            <li>
                                                Add a story title.
                                            </li>
                                        )}

                                        {!reviewingStory.description.trim() && (
                                            <li>
                                                Add a story description.
                                            </li>
                                        )}

                                        {!hasValidStoryPoints && (
                                            <li>
                                                Set valid story points:
                                                1, 2, 3, 5, 8, 13 or 21.
                                            </li>
                                        )}

                                        {!hasValidPriority && (
                                            <li>
                                                Select a valid story
                                                priority.
                                            </li>
                                        )}

                                        {!hasValidAcceptanceCriteria && (
                                            <li>
                                                Add at least one
                                                acceptance criterion
                                                with a description.
                                            </li>
                                        )}

                                        {!allReadinessChecksComplete && (
                                            <li>
                                                Complete all Definition
                                                of Ready checklist items.
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                        {/* API error */}
                        {readinessError && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                <div>
                                    <p className="font-medium">
                                        Could not mark story as Ready
                                    </p>
                                    <p className="mt-1">
                                        {readinessError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Modal actions */}
                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeReadinessReview}
                                disabled={isReadinessUpdating}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Keep as Draft
                            </button>

                            <button
                                type="button"
                                onClick={handleMarkStoryReady}
                                disabled={
                                    !canMarkStoryReady ||
                                    isReadinessUpdating
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isReadinessUpdating && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}

                                {isReadinessUpdating
                                    ? "Marking as Ready..."
                                    : "Mark as Ready"}
                            </button>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                            The story status is saved to the server.
                            Checklist selections are currently local
                            to this review and are not persisted.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
