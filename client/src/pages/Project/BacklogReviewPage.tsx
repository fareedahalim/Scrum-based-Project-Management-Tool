
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import { useGetProjectById } from "../../hooks/Project/ProjectHook";
import { useGetProjectMembers } from "../../hooks/Project/ProjectMemberHook";
import { useGetEpicsByProject } from "../../hooks/Epic/EpicHook";
import {
  getStoriesByProject,
  type Story,
} from "../../services/Story/storyService";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as {
      response?: { data?: { message?: string } };
    }).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading the backlog review.";
}

function percent(ready: number, total: number): number {
  if (total === 0) return 0;

  return Math.round((ready / total) * 100);
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      {helper && (
        <p className="mt-1 text-xs text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}

export default function BacklogReviewPage() {
  const { projectId = "" } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const currentUser = useSelector(
    (state: RootState) => state.auth.user
  );

  // Fetch project details.
  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
    error: projectErrorValue,
    refetch: refetchProject,
  } = useGetProjectById(projectId);

  // Fetch project members.
  const {
    data: projectMembersData,
    isLoading: membersLoading,
    isError: membersError,
    error: membersErrorValue,
    refetch: refetchMembers,
  } = useGetProjectMembers(projectId);

  // Fetch active and archived Epics.
  const {
    data: epicsData,
    isLoading: epicsLoading,
    isError: epicsError,
    error: epicsErrorValue,
    refetch: refetchEpics,
  } = useGetEpicsByProject(projectId, false);

  // Fetch all non-archived Stories with pagination.
  const {
    data: allStories,
    isLoading: storiesLoading,
    isError: storiesError,
    error: storiesErrorValue,
    refetch: refetchStories,
  } = useQuery({
    queryKey: ["backlogReviewStories", projectId],
    enabled: Boolean(projectId),

    queryFn: async () => {
      const firstPage = await getStoriesByProject(
        projectId,
        {
          includeArchived: false,
          page: 1,
          limit: 100,
        }
      );

      const stories: Story[] = [
        ...firstPage.stories,
      ];

      for (
        let page = 2;
        page <= firstPage.pagination.totalPages;
        page += 1
      ) {
        const result = await getStoriesByProject(
          projectId,
          {
            includeArchived: false,
            page,
            limit: 100,
          }
        );

        stories.push(...result.stories);
      }

      return stories;
    },
  });

  const [expandedEpics, setExpandedEpics] = useState<
    string[]
  >([]);

  const members = projectMembersData?.members ?? [];

  // Get current user's ID.
  const currentUserId = currentUser
    ? "id" in currentUser
      ? String(currentUser.id)
      : "_id" in currentUser
        ? String(currentUser._id)
        : ""
    : "";

  // Find current user's active project membership.
  const currentMembership = members.find(
    (member) =>
      String(member.userId) === currentUserId &&
      member.status === "ACTIVE"
  );

  const isAdmin = currentUser?.role === "ADMIN";

  const canViewBacklog =
    isAdmin ||
    ["PRODUCT_OWNER", "SCRUM_MASTER", "DEVELOPER"].includes(
      currentMembership?.scrumRole ?? ""
    );

  // Get active Epics.
  const activeEpics = useMemo(
    () =>
      (epicsData ?? []).filter(
        (epic) => !epic.isArchived
      ),
    [epicsData]
  );

  // Only active (non-archived) Stories participate in readiness.
  const activeStories = useMemo(
    () => (allStories ?? []).filter((story) => !story.isArchived),
    [allStories]
  );

  // Group active Stories according to their Epic.
  const storyGroups = useMemo(
    () =>
      activeEpics.map((epic) => {
        const stories = activeStories.filter(
          (story) => String(story.epicId) === String(epic._id)
        );

        const readyCount = stories.filter(
          (story) => story.status === "READY"
        ).length;

        const draftCount = stories.filter(
          (story) => story.status === "DRAFT"
        ).length;

        return {
          epic,
          stories,
          readyCount,
          draftCount,
          totalPoints: stories.reduce(
            (sum, story) =>
              sum +
              (typeof story.storyPoints === "number"
                ? story.storyPoints
                : 0),
            0
          ),
          readiness: percent(readyCount, stories.length),
        };
      }),
    [activeEpics, activeStories]
  );

  // Overall counts use the saved status returned by the API.
  const totalStories = activeStories.length;

  const readyStories = activeStories.filter(
    (story) => story.status === "READY"
  ).length;

  const draftStories = activeStories.filter(
    (story) => story.status === "DRAFT"
  ).length;

  const totalPoints = activeStories.reduce(
    (sum, story) =>
      sum +
      (typeof story.storyPoints === "number"
        ? story.storyPoints
        : 0),
    0
  );

  // An active Story must belong to an active Epic.
  const storiesWithoutEpic = activeStories.filter(
    (story) =>
      !activeEpics.some(
        (epic) => String(epic._id) === String(story.epicId)
      )
  );

  // READY means the Product Owner has completed the DoR review.
  // It does not mean development or acceptance-criteria verification is complete.
  const canDeclareReady =
    totalStories > 0 &&
    readyStories === totalStories &&
    storiesWithoutEpic.length === 0;

  const isLoading =
    projectLoading ||
    membersLoading ||
    epicsLoading ||
    storiesLoading;

  const hasError =
    projectError ||
    membersError ||
    epicsError ||
    storiesError;

  const errorMessage =
    (projectError &&
      getErrorMessage(projectErrorValue)) ||
    (membersError &&
      getErrorMessage(membersErrorValue)) ||
    (epicsError &&
      getErrorMessage(epicsErrorValue)) ||
    (storiesError &&
      getErrorMessage(storiesErrorValue));

  // Expand or collapse an Epic.
  function toggleEpic(epicId: string) {
    setExpandedEpics((previous) =>
      previous.includes(epicId)
        ? previous.filter((id) => id !== epicId)
        : [...previous, epicId]
    );
  }

  // Retry all failed requests.
  async function retryLoading() {
    await Promise.all([
      refetchProject(),
      refetchMembers(),
      refetchEpics(),
      refetchStories(),
    ]);
  }

  // Loading state.
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
        <LoaderCircle
          className="animate-spin"
          size={22}
        />

        <span>Loading backlog review...</span>
      </div>
    );
  }

  // Error state.
  if (hasError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 text-red-600"
          />

          <div>
            <h2 className="font-semibold text-red-800">
              Could not load backlog review
            </h2>

            <p className="mt-1 text-sm text-red-700">
              {errorMessage}
            </p>

            <button
              onClick={retryLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Project not found.
  if (!project) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Project not found
        </h2>

        <Link
          to="/projects"
          className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  // Access control.
  if (!canViewBacklog) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-amber-700" />

          <div>
            <h2 className="font-semibold text-amber-900">
              Project access required
            </h2>

            <p className="mt-1 text-sm text-amber-800">
              You must be an active project member or an
              Admin to view this backlog review.
            </p>

            <button
              onClick={() =>
                navigate(`/projects/${projectId}/backlog`)
              }
              className="mt-4 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              Back to product backlog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* Page heading and navigation */}
      <div>
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            to="/projects"
            className="hover:text-blue-700"
          >
            Projects
          </Link>

          <span>/</span>

          <Link
            to={`/projects/${projectId}`}
            className="hover:text-blue-700"
          >
            {project.name}
          </Link>

          <span>/</span>

          <Link
            to={`/projects/${projectId}/backlog`}
            className="hover:text-blue-700"
          >
            Product Backlog
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-800">
            Review
          </span>
        </nav>

        <button
          onClick={() =>
            navigate(`/projects/${projectId}/backlog`)
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to product backlog
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Backlog Review
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review your active Epics and User Stories
              before Sprint Planning.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <ClipboardCheck size={17} />
            Read-only review
          </span>
        </div>
      </div>

      {/* Empty state */}
      {totalStories === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <ClipboardCheck
            className="mx-auto text-slate-400"
            size={36}
          />

          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            No Stories Yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add User Stories to your product backlog
            before reviewing sprint readiness.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-700">
            Backlog readiness: 0%
          </p>

          <Link
            to={`/projects/${projectId}/backlog`}
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open product backlog
          </Link>
        </div>
      ) : (
        <>
          {/* Backlog metrics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Active Epics"
              value={activeEpics.length}
            />

            <MetricCard
              label="Active Stories"
              value={totalStories}
            />

            <MetricCard
              label="Ready Stories"
              value={readyStories}
            />

            <MetricCard
              label="Draft Stories"
              value={draftStories}
            />

            <MetricCard
              label="Total Story Points"
              value={totalPoints}
              helper="Sum of saved numeric points; missing points count as zero."
            />

            <MetricCard
              label="Backlog Readiness"
              value={`${percent(
                readyStories,
                totalStories
              )}%`}
              helper="Based on saved Story statuses."
            />
          </section>

          {/* Overall readiness */}
          <section
            className={`rounded-xl border p-5 ${
              canDeclareReady
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-3">
              {canDeclareReady ? (
                <CheckCircle2
                  className="mt-0.5 text-emerald-700"
                  size={22}
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 text-amber-700"
                  size={22}
                />
              )}

              <div>
                <h2
                  className={`font-semibold ${
                    canDeclareReady
                      ? "text-emerald-900"
                      : "text-amber-900"
                  }`}
                >
                  {canDeclareReady
                    ? "Ready for Sprint Planning"
                    : "Needs Attention"}
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    canDeclareReady
                      ? "text-emerald-800"
                      : "text-amber-800"
                  }`}
                >
                  {canDeclareReady
                    ? "Every active Story has passed the Product Owner's Definition of Ready."
                    : `${totalStories - readyStories} ${
                        totalStories - readyStories === 1
                          ? "Story is"
                          : "Stories are"
                      } not READY yet. Complete the DoR review in Product Backlog.`}
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  READY means the Product Owner has approved
                  the Story for Sprint Planning. Acceptance
                  Criteria completion is a separate developer
                  implementation and Product Owner verification
                  workflow.
                </p>

                {storiesWithoutEpic.length > 0 && (
                  <p className="mt-2 text-sm font-medium text-amber-900">
                    {storiesWithoutEpic.length} Story/Stories
                    could not be matched to an active Epic.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Epic-wise review */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Epic-wise Review
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Expand an Epic to see its saved Story statuses
                and readiness progress.
              </p>
            </div>

            {storyGroups.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                No active Epics were found for this project.
              </div>
            ) : (
              storyGroups.map((group) => {
                const isExpanded = expandedEpics.includes(
                  group.epic._id
                );

                return (
                  <div
                    key={group.epic._id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* Epic header */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleEpic(group.epic._id)
                      }
                      className="flex w-full flex-col gap-4 p-5 text-left hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        {isExpanded ? (
                          <ChevronDown
                            className="mt-1 shrink-0 text-slate-500"
                            size={18}
                          />
                        ) : (
                          <ChevronRight
                            className="mt-1 shrink-0 text-slate-500"
                            size={18}
                          />
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {group.epic.key}
                          </p>

                          <h3 className="mt-1 font-semibold text-slate-900">
                            {group.epic.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {group.stories.length} Stories ·{" "}
                            {group.readyCount} ready ·{" "}
                            {group.draftCount} drafts ·{" "}
                            {group.totalPoints} points
                          </p>
                        </div>
                      </div>

                      {/* Epic readiness progress */}
                      <div className="w-full sm:max-w-44">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>Story readiness</span>
                          <span>{group.readiness}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${group.readiness}%`,
                            }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Epic Stories */}
                    {isExpanded && (
                      <div className="border-t border-slate-200">
                        {group.stories.length === 0 ? (
                          <p className="p-5 text-sm text-slate-500">
                            This Epic has no active Stories yet.
                          </p>
                        ) : (
                          group.stories.map((story) => (
                            <div
                              key={story._id}
                              className="border-b border-slate-100 p-5 last:border-b-0"
                            >
                              {/* Story information */}
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-xs font-semibold text-slate-500">
                                    {story.key}
                                  </p>

                                  <h4 className="mt-1 font-semibold text-slate-900">
                                    {story.title}
                                  </h4>

                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                                      {story.status}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                      {story.priority ??
                                        "No priority"}
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                      {story.storyPoints ??
                                        "No points"}{" "}
                                      points
                                    </span>
                                  </div>
                                </div>

                                <Link
                                  to={`/projects/${projectId}/stories?storyId=${story._id}`}
                                  className="text-sm font-medium text-blue-700 hover:underline"
                                >
                                  View Story
                                </Link>
                              </div>

                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </>
      )}
    </div>
  );
}
