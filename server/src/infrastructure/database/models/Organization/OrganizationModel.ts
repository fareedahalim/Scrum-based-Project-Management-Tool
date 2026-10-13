import { Schema, model, type Document } from "mongoose";

export interface OrganizationDocument extends Document {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OrganizationModel = model<OrganizationDocument>(
  "Organization",
  organizationSchema
);