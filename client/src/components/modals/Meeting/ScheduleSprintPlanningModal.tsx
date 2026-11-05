
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";

import { useCreateSprintPlanningMeeting } from "../../../hooks/Meeting/meetingHooks";
import type { Epic } from "../../../services/Epic/epicService";
import type { Story } from "../../../services/Story/storyService";
import { createSprintPlanningMeetingSchema } from "../../../lib/validations/createSprintPlanningMeeting.schema";

interface ScheduleSprintPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    readyStories: Story[];
    epics: Epic[];
}

type MeetingFormErrors = Partial<
    Record<
        | "title"
        | "meetingDate"
        | "meetingTime"
        | "agenda"
        | "meetingLink"
        | "selectedStoryIds",
        string
    >
>;

const ScheduleSprintPlanningModal = ({
    isOpen,
    onClose,
    projectId,
    readyStories,
    epics,
}: ScheduleSprintPlanningModalProps) => {
    const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
    const [title, setTitle] = useState("Sprint Planning Meeting");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [agenda, setAgenda] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [errors, setErrors] = useState<MeetingFormErrors>({});

    const createMeetingMutation =
        useCreateSprintPlanningMeeting(projectId);

    const clearFieldError = (field: keyof MeetingFormErrors) => {
        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationResult = createSprintPlanningMeetingSchema.safeParse({
            title,
            meetingDate,
            meetingTime,
            agenda,
            meetingLink,
            selectedStoryIds,
        });

        if (!validationResult.success) {
            const fieldErrors =
                validationResult.error.flatten().fieldErrors;

            setErrors({
                title: fieldErrors.title?.[0],
                meetingDate: fieldErrors.meetingDate?.[0],
                meetingTime: fieldErrors.meetingTime?.[0],
                agenda: fieldErrors.agenda?.[0],
                meetingLink: fieldErrors.meetingLink?.[0],
                selectedStoryIds: fieldErrors.selectedStoryIds?.[0],
            });

            return;
        }

        setErrors({});

        createMeetingMutation.mutate(
            {
                title: validationResult.data.title,
                meetingDate: validationResult.data.meetingDate,
                meetingTime: validationResult.data.meetingTime,
                agenda: validationResult.data.agenda,
                meetingLink:
                    validationResult.data.meetingLink || undefined,
                selectedStoryIds:
                    validationResult.data.selectedStoryIds,
            },
            {
                onSuccess: () => {
                    toast.success(
                        "Sprint Planning meeting scheduled successfully!",
                    );

                    setSelectedStoryIds([]);
                    setTitle("Sprint Planning Meeting");
                    setMeetingDate("");
                    setMeetingTime("");
                    setAgenda("");
                    setMeetingLink("");
                    setErrors({});

                    onClose();
                },
                onError: () => {
                    toast.error(
                        "Failed to schedule Sprint Planning meeting.",
                    );
                },
            },
        );
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        Schedule Sprint Planning
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-2xl text-slate-500 hover:text-slate-900"
                    >
                        ×
                    </button>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                    Schedule a meeting to discuss READY stories
                    and finalize the sprint scope.
                </p>

                <form onSubmit={handleSubmit} noValidate>

                    {/* READY Stories */}
                    <div className="mt-6">
                        <h3 className="mb-3 text-sm font-semibold text-slate-800">
                            Select READY Stories
                        </h3>

                        {readyStories.length === 0 ? (
                            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                                No READY stories available for this project.
                            </p>
                        ) : (
                            <div className="max-h-64 space-y-2 overflow-y-auto">
                                {readyStories.map((story) => {
                                    const epic = epics.find(
                                        (item) => item._id === story.epicId,
                                    );

                                    return (
                                        <label
                                            key={story._id}
                                            className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStoryIds.includes(
                                                    story._id,
                                                )}
                                                onChange={(e) => {
                                                    setSelectedStoryIds(
                                                        (previous) =>
                                                            e.target.checked
                                                                ? [
                                                                    ...previous,
                                                                    story._id,
                                                                ]
                                                                : previous.filter(
                                                                    (id) =>
                                                                        id !== story._id,
                                                                ),
                                                    );

                                                    clearFieldError(
                                                        "selectedStoryIds",
                                                    );
                                                }}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-800">
                                                    {story.key} - {story.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Epic: {epic?.name ?? "Unknown Epic"}
                                                    {" • "}
                                                    Points: {story.storyPoints ?? "Not assigned"}
                                                    {" • "}
                                                    Priority: {story.priority}
                                                </p>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}

                        {errors.selectedStoryIds && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.selectedStoryIds}
                            </p>
                        )}
                    </div>

                    {/* Meeting Details */}
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Meeting Details
                        </h3>

                        {/* Meeting Title */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Meeting Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    clearFieldError("title");
                                }}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                placeholder="Enter meeting title"
                            />

                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Meeting Date
                                </label>

                                <input
                                    type="date"
                                    value={meetingDate}
                                    onChange={(e) => {
                                        setMeetingDate(e.target.value);
                                        clearFieldError("meetingDate");
                                    }}
                                    min={(() => {
                                        const today = new Date();
                                        return [
                                            today.getFullYear(),
                                            String(today.getMonth() + 1).padStart(2, "0"),
                                            String(today.getDate()).padStart(2, "0"),
                                        ].join("-");
                                    })()}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />

                                {errors.meetingDate && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.meetingDate}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Meeting Time
                                </label>

                                <input
                                    type="time"
                                    value={meetingTime}
                                    onChange={(e) => {
                                        setMeetingTime(e.target.value);
                                        clearFieldError("meetingTime");
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                />

                                {errors.meetingTime && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.meetingTime}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Agenda */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Agenda
                            </label>

                            <textarea
                                value={agenda}
                                onChange={(e) => {
                                    setAgenda(e.target.value);
                                    clearFieldError("agenda");
                                }}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                placeholder="Enter the meeting agenda"
                            />

                            {errors.agenda && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.agenda}
                                </p>
                            )}
                        </div>

                        {/* Meeting Link */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Meeting Link (Optional)
                            </label>

                            <input
                                type="url"
                                value={meetingLink}
                                onChange={(e) => {
                                    setMeetingLink(e.target.value);
                                    clearFieldError("meetingLink");
                                }}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                placeholder="https://meet.google.com/..."
                            />

                            {errors.meetingLink && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.meetingLink}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={createMeetingMutation.isPending}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={createMeetingMutation.isPending}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createMeetingMutation.isPending
                                ? "Scheduling..."
                                : "Schedule Meeting"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleSprintPlanningModal;
