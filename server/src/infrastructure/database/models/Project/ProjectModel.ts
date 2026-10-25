
import mongoose, { Document, Types } from "mongoose";

import { ProjectStatus } from "../../../../domain/enums/ProjectStatus";
import { ProjectPriority } from "../../../../domain/enums/ProjectPriority";

export interface ProjectDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  key: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate: Date | null;
  teamId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.PLANNING,
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
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
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

// Index for filtering projects by team
projectSchema.index({ teamId: 1, createdAt: -1 });

// Index for filtering projects by status
projectSchema.index({ status: 1 });

export const ProjectModel = mongoose.model<ProjectDocument>(
  "Project",
  projectSchema
);
