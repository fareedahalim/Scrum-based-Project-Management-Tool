
import { ITeamEntity } from "../../domain/entities/Team/ITeamEntity";
import { TeamDocument } from "../database/models/Team/TeamModel";

export class TeamMapper {
    static toEntity(doc: TeamDocument): ITeamEntity {
        return {
            _id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            lead: doc.lead.toString(),
            isDeleted: doc.isDeleted,
            deletedAt: doc.deletedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}