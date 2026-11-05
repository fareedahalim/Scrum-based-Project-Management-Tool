import mongoose, { Document, Types } from "mongoose";

import { MeetingStatus } from "../../../../domain/enums/MeetingStatus";

export interface SprintPlanningMeetingDocument extends Document {
    _id: Types.ObjectId;
    projectId: Types.ObjectId;
    title: string;
    meetingDate: Date;
    meetingTime: string;
    agenda: string;
    meetingLink?: string;
    selectedStoryIds: Types.ObjectId[];
    status: MeetingStatus;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const sprintPlanningMeetingSchema =
    new mongoose.Schema<SprintPlanningMeetingDocument>(
        {
            projectId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
                required: true,
            },
            title: {
                type: String,
                required: true,
                trim: true,
            },
            meetingDate: {
                type: Date,
                required: true,
            },
            meetingTime: {
                type: String,
                required: true,
                trim: true,
            },
            agenda: {
                type: String,
                required: true,
                trim: true,
            },
            meetingLink: {
                type: String,
                trim: true,
                default: undefined,
            },
            selectedStoryIds: {
                type: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Story",
                    },
                ],
                default: [],
            },
            status: {
                type: String,
                enum: Object.values(MeetingStatus),
                default: MeetingStatus.SCHEDULED,
                required: true,
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

// Helps retrieve meetings by project and date.
sprintPlanningMeetingSchema.index({
    projectId: 1,
    meetingDate: 1,
});

export const SprintPlanningMeetingModel =
    mongoose.model<SprintPlanningMeetingDocument>(
        "SprintPlanningMeeting",
        sprintPlanningMeetingSchema
    );