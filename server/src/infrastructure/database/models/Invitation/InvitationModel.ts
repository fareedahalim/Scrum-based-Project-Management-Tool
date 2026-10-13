import mongoose, { Document, Types } from "mongoose";
import { IInvitationEntity } from "../../../../domain/entities/Invitation/IInvitationEntity";

export interface InvitationDocument
    extends Document {
    _id: Types.ObjectId;

    email: string;

    role: "MEMBER";

    invitedBy: Types.ObjectId;

    expiresAt: Date;

    status:
        | "PENDING"
        | "ACCEPTED"
        | "EXPIRED"
        | "CANCELLED";

    createdAt?: Date;

    updatedAt?: Date;
}

const invitationSchema =
    new mongoose.Schema<InvitationDocument>(
        {
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },

            role: {
                type: String,
                enum: ["MEMBER"],
                required: true,
                default: "MEMBER",
            },

            invitedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            expiresAt: {
                type: Date,
                required: true,
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "ACCEPTED",
                    "EXPIRED",
                    "CANCELLED",
                ],
                required: true,
                default: "PENDING",
            },
        },
        {
            timestamps: true,
        }
    );

export const InvitationModel =
    mongoose.model<InvitationDocument>(
        "Invitation",
        invitationSchema
    );