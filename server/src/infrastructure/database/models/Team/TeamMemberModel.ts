import mongoose, {
  Document,
  Types,
} from "mongoose";

export interface TeamMemberDocument
  extends Document {
  _id: Types.ObjectId;
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  joinedAt: Date;
}

const teamMemberSchema =
  new mongoose.Schema<TeamMemberDocument>(
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      joinedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    {
      timestamps: false,
    }
  );

teamMemberSchema.index(
  { userId: 1 },
  { unique: true }
);

export const TeamMemberModel =
  mongoose.model<TeamMemberDocument>(
    "TeamMember",
    teamMemberSchema
  );