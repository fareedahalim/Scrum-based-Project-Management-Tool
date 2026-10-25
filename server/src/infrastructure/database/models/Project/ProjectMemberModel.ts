
import mongoose, { Document, Types } from "mongoose";

import { ProjectScrumRole } from "../../../../domain/enums/ProjectScrumRole";
import { ProjectMemberStatus } from "../../../../domain/enums/ProjectMemberStatus";

export interface ProjectMemberDocument extends Document {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  scrumRole: ProjectScrumRole;
  status: ProjectMemberStatus;
  assignedAt: Date;
  completedAt: Date | null;
}

const projectMemberSchema =
  new mongoose.Schema<ProjectMemberDocument>(
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      scrumRole: {
        type: String,
        enum: Object.values(ProjectScrumRole),
        required: true,
      },

      status: {
        type: String,
        enum: Object.values(ProjectMemberStatus),
        default: ProjectMemberStatus.ACTIVE,
        required: true,
      },

      assignedAt: {
        type: Date,
        default: Date.now,
        required: true,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: false,
    }
  );

// A user can have only one membership record per project
projectMemberSchema.index(
  { projectId: 1, userId: 1 },
  { unique: true }
);

// Useful for retrieving active members of a project
projectMemberSchema.index({ projectId: 1, status: 1 });

export const ProjectMemberModel =
  mongoose.model<ProjectMemberDocument>(
    "ProjectMember",
    projectMemberSchema
  );
