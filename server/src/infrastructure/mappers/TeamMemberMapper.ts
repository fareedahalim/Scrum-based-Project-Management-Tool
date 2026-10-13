import { ITeamMemberEntity } from "../../domain/entities/TeamMember/ITeamMemberEntity";
import { TeamMemberDocument } from "../database/models/Team/TeamMemberModel";

export class TeamMemberMapper {
  static toEntity(
    doc: TeamMemberDocument
  ): ITeamMemberEntity {
    return {
      _id: doc._id.toString(),
      teamId: doc.teamId.toString(),
      userId: doc.userId.toString(),
      joinedAt: doc.joinedAt,
    };
  }
}