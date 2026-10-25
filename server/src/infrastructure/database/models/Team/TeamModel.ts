import mongoose, { Document, Types } from "mongoose";

export interface TeamDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    lead: Types.ObjectId;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}


const teamSchema = new mongoose.Schema<TeamDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },

    },
    {
        timestamps: true,
    }
);


teamSchema.index(
    { name: 1 },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
        collation: {
            locale: "en",
            strength: 2,
        },
    }
);

export const TeamModel = mongoose.model<TeamDocument>(
 'Team',
 teamSchema
);