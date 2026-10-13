import { IInvitationEntity } from "../../domain/entities/Invitation/IInvitationEntity";
import { InvitationDocument } from "../database/models/Invitation/InvitationModel";

export class InvitationMapper {
  static toEntity(
    doc: InvitationDocument
  ): IInvitationEntity {
    return {
      _id: doc._id.toString(),
      email: doc.email,
      role: doc.role,
      invitedBy: doc.invitedBy.toString(),
      expiresAt: doc.expiresAt,
      status: doc.status,
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.updatedAt ?? new Date(),
    };
  }
}