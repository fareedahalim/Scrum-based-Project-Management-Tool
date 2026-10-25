import mongoose, { Document, Types } from "mongoose";
import { EpicStatus } from "../../../../domain/enums/EpicStatus";
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

export interface EpicDocument extends Document {
    _id: Types.ObjectId;
    projectId: Types.ObjectId;
    name: string;
    key: string;
    description: string;
    status: EpicStatus;
    priority: ProjectPriority;
    startDate: Date | null;
    targetDate: Date | null;
    targetRelease: string | null;
    isArchived: boolean;
    archivedAt: Date | null;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


const epicSchema = new mongoose.Schema<EpicDocument>(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        key: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(EpicStatus),
            default: EpicStatus.OPEN,
            required: true,
        },
        priority: {
            type: String,
            enum: Object.values(ProjectPriority),
            default: ProjectPriority.MEDIUM,
            required: true,
        },
        startDate: {
            type: Date,
            default: null
        },
        targetDate: {
            type: Date,
            default: null,
        },
        targetRelease: {
            type: String,
            default: null,
            trim: true,
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
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

epicSchema.index(
    {projectId: 1, key: 1},
    {unique: true}
)

epicSchema.index({projectId:1, isArchived: 1});

export const EpicModel = mongoose.model<EpicDocument>(
    "Epic",
    epicSchema
);
