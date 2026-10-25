import mongoose, { Document, Types } from "mongoose";

import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";
import { StoryStatus } from "../../../../domain/enums/StoryStatus";

export interface AcceptanceCriterionDocument {
    id: string;
    description: string;
    isCompleted: boolean;
}

export interface StoryDocument extends Document {
    _id: Types.ObjectId;
    projectId: Types.ObjectId;
    epicId: Types.ObjectId;
    key: string;
    title: string;
    description: string;
    priority: ProjectPriority;
    storyPoints: number | null;
    status: StoryStatus;
    acceptanceCriteria: AcceptanceCriterionDocument[];
    labels: string[];
    isArchived: boolean;
    archivedAt: Date | null;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const acceptanceCriterionSchema =
    new mongoose.Schema<AcceptanceCriterionDocument>(
        {
            id: {
                type: String,
                required: true,
                trim: true,
            },
            description: {
                type: String,
                required: true,
                trim: true,
            },
            isCompleted: {
                type: Boolean,
                default: false,
                required: true,
            },
        },
        {
            _id: false,
        }
    );

const storySchema = new mongoose.Schema<StoryDocument>(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        epicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Epic",
            required: true,
        },
        key: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        priority: {
            type: String,
            enum: Object.values(ProjectPriority),
            default: ProjectPriority.MEDIUM,
            required: true,
        },
        storyPoints: {
            type: Number,
            enum: [1, 2, 3, 5, 8, 13, 21, null],
            default: null,
        },
        status: {
            type: String,
            enum: Object.values(StoryStatus),
            default: StoryStatus.DRAFT,
            required: true,
        },
        acceptanceCriteria: {
            type: [acceptanceCriterionSchema],
            default: [],
        },
        labels: {
            type: [String],
            default: [],
        },
        isArchived: {
            type: Boolean,
            default: false,
            required: true,
        },
        archivedAt: {
            type: Date,
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// A Story key must be unique within its project.
storySchema.index(
    { projectId: 1, key: 1 },
    { unique: true }
);

// Helps retrieve non-archived Stories by project and Epic.
storySchema.index({
    projectId: 1,
    epicId: 1,
    isArchived: 1,
});

export const StoryModel = mongoose.model<StoryDocument>(
    "Story",
    storySchema
);