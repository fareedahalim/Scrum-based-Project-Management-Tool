import { injectable } from "tsyringe";

import { IInvitationRepository } from "../../../../domain/interfaces/repositories/Invitation/IInvitationRepository";
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
        { expiresAt },
        { new: true }
      );

    if (!updatedInvitation) {
      return null;
    }

    return InvitationMapper.toEntity(
      updatedInvitation
    );
  }

  async getAllInvitations(): Promise<IInvitationEntity[]> {
    const invitations = await InvitationModel
      .find()
      .sort({ createdAt: -1 });

    return invitations.map((invitation) =>
      InvitationMapper.toEntity(invitation)
    );
  }
}