import { injectable } from "tsyringe";
import { ITeamEntity } from "../../../../domain/entities/Team/ITeamEntity";
import { TeamModel } from "../../models/Team/TeamModel";
import { TeamMapper } from "../../../mappers/TeamMapper";
import { TeamMemberModel } from "../../models/Team/TeamMemberModel";
import { ITeamRepository } from "../../../../domain/interfaces/repositories/Team/ITeamRepository";
@injectable()
export class TeamRepository implements ITeamRepository {

   
async createTeam(team: ITeamEntity): Promise<ITeamEntity> {
    const createdTeam = await TeamModel.create({
        name: team.name,
        description: team.description,
        lead: team.lead,
        isDeleted: false,
        deletedAt: null,
    });

    return TeamMapper.toEntity(createdTeam);
}

    async findById(
        teamId: string
    ): Promise<ITeamEntity | null> {
        const team = await TeamModel.findOne({
            _id: teamId,
            isDeleted: false
        });

        if (!team) {
            return null;
        }

        return TeamMapper.toEntity(team);
    }


    async findByName(
        name: string
    ): Promise<ITeamEntity | null> {
        const team = await TeamModel.findOne({
            name: name.trim(),
            isDeleted: false,
        }).collation({
            locale: "en",
            strength: 2,
        });

        if (!team) {
            return null;
        }

        return TeamMapper.toEntity(team);
    }

    async getAllTeams(): Promise<ITeamEntity[]> {
        const teams = await TeamModel.find({
            isDeleted: false,
        })
            .sort({ createdAt: -1 });

        return teams.map(TeamMapper.toEntity);
    }


    async getTeamsByMember(
        userId: string
    ): Promise<ITeamEntity[]> {
        const teamMembers = await TeamMemberModel.find({
            userId,
        }).select("teamId");

        const teamIds = teamMembers.map(
            (member) => member.teamId
        );

        if (teamIds.length === 0) {
            return [];
        }

        const teams = await TeamModel.find({
            _id: {
                $in: teamIds,
            }, isDeleted: false,
        }).sort({ createdAt: -1 });

        return teams.map(TeamMapper.toEntity);
    }

   
async updateTeam(
    teamId: string,
    updateData: Partial<ITeamEntity>
): Promise<ITeamEntity | null> {
    const { name, description } = updateData;

    const updatedTeam = await TeamModel.findOneAndUpdate(
        {
            _id: teamId,
            isDeleted: false,
        },
        {
            $set: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                updatedAt: new Date(),
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedTeam) {
        return null;
    }

    return TeamMapper.toEntity(updatedTeam);
}

    async updateLead(
    teamId: string,
    leadId: string
): Promise<ITeamEntity | null> {
    const updatedTeam = await TeamModel.findOneAndUpdate(
        {
            _id: teamId,
            isDeleted: false,
        },
        {
            $set: {
                lead: leadId,
                updatedAt: new Date(),
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedTeam) {
        return null;
    }

    return TeamMapper.toEntity(updatedTeam);
}

   
async deleteTeam(teamId: string): Promise<boolean> {
   const result = await TeamModel.updateOne(
    {
        _id: teamId,
        isDeleted: false,
    },
    {
        $set: {
            isDeleted:true,
            deletedAt: new Date(),
        }
    }
   )

    return result.modifiedCount === 1;
}
}