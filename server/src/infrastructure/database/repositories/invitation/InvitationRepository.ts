import { injectable } from "tsyringe";

import { IInvitationRepository, InvitationSearchParams, PaginatedInvitations } from "../../../../domain/interfaces/repositories/Invitation/IInvitationRepository";
import { IInvitationEntity } from "../../../../domain/entities/Invitation/IInvitationEntity";

import {
  InvitationDocument,
  InvitationModel,
} from "../../models/Invitation/InvitationModel";

import { InvitationMapper } from "../../../mappers/InvitationMapper";

@injectable()
export class InvitationRepository
  implements IInvitationRepository {
  async createInvitation(
    invitation: IInvitationEntity
  ): Promise<IInvitationEntity> {
    const createdInvitation =
      await InvitationModel.create({
        email: invitation.email,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
        expiresAt: invitation.expiresAt,
        status: invitation.status,
      });

    return InvitationMapper.toEntity(
      createdInvitation
    );
  }

  async findById(
    id: string
  ): Promise<IInvitationEntity | null> {
    const invitation =
      await InvitationModel.findById(id);

    if (!invitation) {
      return null;
    }

    return InvitationMapper.toEntity(
      invitation
    );
  }

  async findPendingByEmail(
    email: string
  ): Promise<IInvitationEntity | null> {
    const invitation =
      await InvitationModel.findOne({
        email: email.toLowerCase(),
        status: "PENDING",
      });

    if (!invitation) {
      return null;
    }

    return InvitationMapper.toEntity(
      invitation
    );
  }

  async updateStatus(
    id: string,
    status: IInvitationEntity["status"]
  ): Promise<IInvitationEntity | null> {
    const updatedInvitation =
      await InvitationModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

    if (!updatedInvitation) {
      return null;
    }

    return InvitationMapper.toEntity(
      updatedInvitation
    );
  }

  async updateExpiry(
    id: string,
    expiresAt: Date
  ): Promise<IInvitationEntity | null> {
    const updatedInvitation =
      await InvitationModel.findByIdAndUpdate(
        id,
        {
          expiresAt,
          status: "PENDING",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedInvitation) {
      return null;
    }

    return InvitationMapper.toEntity(updatedInvitation);
  }


  async getAllInvitations(
    params: InvitationSearchParams
  ): Promise<PaginatedInvitations> {
    // Update expired pending invitations first.
    await InvitationModel.updateMany(
      {
        status: "PENDING",
        expiresAt: { $lte: new Date() },
      },
      {
        $set: { status: "EXPIRED" },
      }
    );

    const { search, status, page, limit } = params;

    // Build the MongoDB filter.
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (search?.trim()) {
      // Escape special regex characters.
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.email = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    // Calculate how many records to skip.
    const skip = (page - 1) * limit;

    // Fetch only the records for the requested page.
    const [invitations, total] = await Promise.all([
      InvitationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      InvitationModel.countDocuments(filter),
    ]);

    return {
      invitations: invitations.map((invitation) =>
        InvitationMapper.toEntity(invitation)
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

}