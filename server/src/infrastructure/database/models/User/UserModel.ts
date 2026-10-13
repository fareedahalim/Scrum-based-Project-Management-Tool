import mongoose, { Document, Types } from "mongoose";
import { UserRoles } from "../../../../domain/enums/UserRole";

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;

    role: UserRoles;

    isActive: boolean;
    isEmailVerified: boolean;

    profileImage?: string;
    lastActive?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: false,
            trim: true
        },

        password: {
            type: String,
            required: false,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,

        },

        role: {
            type: String,
            enum: Object.values(UserRoles),
            required: true,
            default: UserRoles.MEMBER
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        profileImage: {
            type: String,
            required: false
        },

        lastActive: {
            type: Date,
            required: false,
        }
    }, {
    timestamps: true,
}
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema)